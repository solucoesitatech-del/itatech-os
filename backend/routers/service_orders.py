from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
from models.schemas import (
    ServiceOrder,
    ServiceOrderCreate,
    StatusUpdate,
    StatusHistoryEntry,
    Budget,
    BudgetItem,
)
from database import service_orders_collection, status_history_collection
from auth import get_current_tenant_id, check_tenant_match

router = APIRouter(prefix="/api/service-orders", tags=["service_orders"])


async def _gerar_numero_os(tenant_id: str) -> str:
    count = await service_orders_collection.count_documents({"tenant_id": tenant_id})
    return f"OS-{count + 1:05d}"


@router.post("/", response_model=ServiceOrder)
async def create_service_order(
    data: ServiceOrderCreate, current_tenant_id: str = Depends(get_current_tenant_id)
):
    check_tenant_match(current_tenant_id, data.tenant_id)
    numero_os = await _gerar_numero_os(data.tenant_id)
    order = ServiceOrder(numero_os=numero_os, **data.dict())
    await service_orders_collection.insert_one(order.dict())

    history = StatusHistoryEntry(
        service_order_id=order.id, status_anterior=None, status_novo=order.status
    )
    await status_history_collection.insert_one(history.dict())
    return order


@router.get("/tenant/{tenant_id}", response_model=List[ServiceOrder])
async def list_orders_by_tenant(
    tenant_id: str, current_tenant_id: str = Depends(get_current_tenant_id)
):
    check_tenant_match(current_tenant_id, tenant_id)
    orders = await service_orders_collection.find({"tenant_id": tenant_id}).sort(
        "criado_em", -1
    ).to_list(1000)
    return [ServiceOrder(**o) for o in orders]


@router.get("/{order_id}", response_model=ServiceOrder)
async def get_order(
    order_id: str, current_tenant_id: str = Depends(get_current_tenant_id)
):
    order = await service_orders_collection.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Ordem de serviço não encontrada")
    check_tenant_match(current_tenant_id, order["tenant_id"])
    return ServiceOrder(**order)


@router.patch("/{order_id}/status", response_model=ServiceOrder)
async def update_status(
    order_id: str,
    data: StatusUpdate,
    current_tenant_id: str = Depends(get_current_tenant_id),
):
    order = await service_orders_collection.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Ordem de serviço não encontrada")
    check_tenant_match(current_tenant_id, order["tenant_id"])

    status_anterior = order["status"]
    await service_orders_collection.update_one(
        {"id": order_id},
        {"$set": {"status": data.novo_status, "atualizado_em": datetime.utcnow()}},
    )

    history = StatusHistoryEntry(
        service_order_id=order_id,
        status_anterior=status_anterior,
        status_novo=data.novo_status,
    )
    await status_history_collection.insert_one(history.dict())

    # TODO: disparar notificação automática pelo WhatsApp aqui
    updated = await service_orders_collection.find_one({"id": order_id})
    return ServiceOrder(**updated)


@router.post("/{order_id}/orcamento", response_model=ServiceOrder)
async def set_budget(
    order_id: str,
    itens: List[BudgetItem],
    current_tenant_id: str = Depends(get_current_tenant_id),
):
    order = await service_orders_collection.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Ordem de serviço não encontrada")
    check_tenant_match(current_tenant_id, order["tenant_id"])

    valor_total = sum(i.valor for i in itens)
    budget = Budget(itens=itens, valor_total=valor_total, aprovado=False)
    await service_orders_collection.update_one(
        {"id": order_id}, {"$set": {"orcamento": budget.dict()}}
    )
    updated = await service_orders_collection.find_one({"id": order_id})
    return ServiceOrder(**updated)


# ---------- Endpoints públicos (acesso via link, sem login) ----------
public_router = APIRouter(prefix="/api/acompanhar", tags=["public_tracking"])


@public_router.get("/{token_publico}", response_model=ServiceOrder)
async def track_order(token_publico: str):
    order = await service_orders_collection.find_one({"token_publico": token_publico})
    if not order:
        raise HTTPException(status_code=404, detail="Link inválido ou expirado")
    return ServiceOrder(**order)


@public_router.post("/{token_publico}/aprovar-orcamento", response_model=ServiceOrder)
async def approve_budget(token_publico: str):
    order = await service_orders_collection.find_one({"token_publico": token_publico})
    if not order:
        raise HTTPException(status_code=404, detail="Link inválido ou expirado")

    await service_orders_collection.update_one(
        {"token_publico": token_publico},
        {
            "$set": {
                "orcamento.aprovado": True,
                "orcamento.aprovado_em": datetime.utcnow(),
            }
        },
    )
    updated = await service_orders_collection.find_one({"token_publico": token_publico})
    return ServiceOrder(**updated)


@public_router.post("/{token_publico}/assinar", response_model=ServiceOrder)
async def sign_order(token_publico: str, assinatura_base64: str):
    order = await service_orders_collection.find_one({"token_publico": token_publico})
    if not order:
        raise HTTPException(status_code=404, detail="Link inválido ou expirado")

    await service_orders_collection.update_one(
        {"token_publico": token_publico},
        {"$set": {"assinatura_cliente": assinatura_base64}},
    )
    updated = await service_orders_collection.find_one({"token_publico": token_publico})
    return ServiceOrder(**updated)
