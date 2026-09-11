from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
from models.schemas import Payment, PaymentCreate, PaymentStatus
from database import payments_collection
from auth import get_current_tenant_id, check_tenant_match

router = APIRouter(prefix="/api/payments", tags=["payments"])


@router.post("/", response_model=Payment)
async def create_payment(
    data: PaymentCreate, current_tenant_id: str = Depends(get_current_tenant_id)
):
    check_tenant_match(current_tenant_id, data.tenant_id)
    payment = Payment(**data.dict())
    await payments_collection.insert_one(payment.dict())
    return payment


@router.patch("/{payment_id}/pagar", response_model=Payment)
async def mark_as_paid(
    payment_id: str, current_tenant_id: str = Depends(get_current_tenant_id)
):
    payment = await payments_collection.find_one({"id": payment_id})
    if not payment:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado")
    check_tenant_match(current_tenant_id, payment["tenant_id"])

    await payments_collection.update_one(
        {"id": payment_id},
        {"$set": {"status": PaymentStatus.PAGO, "data_pagamento": datetime.utcnow()}},
    )
    updated = await payments_collection.find_one({"id": payment_id})
    return Payment(**updated)


@router.get("/tenant/{tenant_id}", response_model=List[Payment])
async def list_payments_by_tenant(
    tenant_id: str, current_tenant_id: str = Depends(get_current_tenant_id)
):
    check_tenant_match(current_tenant_id, tenant_id)
    payments = await payments_collection.find({"tenant_id": tenant_id}).to_list(1000)
    return [Payment(**p) for p in payments]


@router.get("/tenant/{tenant_id}/relatorio-mensal")
async def monthly_report(
    tenant_id: str,
    ano: int,
    mes: int,
    current_tenant_id: str = Depends(get_current_tenant_id),
):
    check_tenant_match(current_tenant_id, tenant_id)
    inicio = datetime(ano, mes, 1)
    fim = datetime(ano + (1 if mes == 12 else 0), 1 if mes == 12 else mes + 1, 1)

    payments = await payments_collection.find(
        {
            "tenant_id": tenant_id,
            "status": PaymentStatus.PAGO,
            "data_pagamento": {"$gte": inicio, "$lt": fim},
        }
    ).to_list(10000)

    total_faturado = sum(p["valor"] for p in payments)
    return {
        "tenant_id": tenant_id,
        "periodo": f"{mes:02d}/{ano}",
        "total_faturado": total_faturado,
        "quantidade_pagamentos": len(payments),
    }
