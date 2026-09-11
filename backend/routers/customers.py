from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models.schemas import Customer, CustomerCreate, Equipment, EquipmentCreate
from database import customers_collection, equipment_collection
from auth import get_current_tenant_id, check_tenant_match

router = APIRouter(prefix="/api/customers", tags=["customers"])


@router.post("/", response_model=Customer)
async def create_customer(
    data: CustomerCreate, current_tenant_id: str = Depends(get_current_tenant_id)
):
    check_tenant_match(current_tenant_id, data.tenant_id)
    customer = Customer(**data.dict())
    await customers_collection.insert_one(customer.dict())
    return customer


@router.get("/tenant/{tenant_id}", response_model=List[Customer])
async def list_customers_by_tenant(
    tenant_id: str, current_tenant_id: str = Depends(get_current_tenant_id)
):
    check_tenant_match(current_tenant_id, tenant_id)
    customers = await customers_collection.find({"tenant_id": tenant_id}).to_list(1000)
    return [Customer(**c) for c in customers]


@router.get("/{customer_id}", response_model=Customer)
async def get_customer(
    customer_id: str, current_tenant_id: str = Depends(get_current_tenant_id)
):
    customer = await customers_collection.find_one({"id": customer_id})
    if not customer:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    check_tenant_match(current_tenant_id, customer["tenant_id"])
    return Customer(**customer)


@router.get("/{customer_id}/equipamentos", response_model=List[Equipment])
async def list_customer_equipment(
    customer_id: str, current_tenant_id: str = Depends(get_current_tenant_id)
):
    customer = await customers_collection.find_one({"id": customer_id})
    if not customer:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    check_tenant_match(current_tenant_id, customer["tenant_id"])

    items = await equipment_collection.find({"customer_id": customer_id}).to_list(1000)
    return [Equipment(**e) for e in items]


equipment_router = APIRouter(prefix="/api/equipment", tags=["equipment"])


@equipment_router.post("/", response_model=Equipment)
async def create_equipment(
    data: EquipmentCreate, current_tenant_id: str = Depends(get_current_tenant_id)
):
    check_tenant_match(current_tenant_id, data.tenant_id)
    equipment = Equipment(**data.dict())
    await equipment_collection.insert_one(equipment.dict())
    return equipment


@equipment_router.get("/{equipment_id}", response_model=Equipment)
async def get_equipment(
    equipment_id: str, current_tenant_id: str = Depends(get_current_tenant_id)
):
    equipment = await equipment_collection.find_one({"id": equipment_id})
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipamento não encontrado")
    check_tenant_match(current_tenant_id, equipment["tenant_id"])
    return Equipment(**equipment)
