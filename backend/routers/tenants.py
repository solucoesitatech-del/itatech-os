from fastapi import APIRouter, HTTPException
from typing import List
from models.schemas import Tenant, TenantCreate, TenantUpdate
from database import tenants_collection

router = APIRouter(prefix="/api/tenants", tags=["tenants"])


@router.post("/", response_model=Tenant)
async def create_tenant(data: TenantCreate):
    existing = await tenants_collection.find_one({"subdominio": data.subdominio})
    if existing:
        raise HTTPException(status_code=400, detail="Subdomínio já está em uso")
    tenant = Tenant(**data.dict())
    await tenants_collection.insert_one(tenant.dict())
    return tenant


@router.get("/", response_model=List[Tenant])
async def list_tenants():
    tenants = await tenants_collection.find().to_list(1000)
    return [Tenant(**t) for t in tenants]


@router.get("/{tenant_id}", response_model=Tenant)
async def get_tenant(tenant_id: str):
    tenant = await tenants_collection.find_one({"id": tenant_id})
    if not tenant:
        raise HTTPException(status_code=404, detail="Prestador não encontrado")
    return Tenant(**tenant)


@router.get("/subdominio/{subdominio}", response_model=Tenant)
async def get_tenant_by_subdomain(subdominio: str):
    tenant = await tenants_collection.find_one({"subdominio": subdominio})
    if not tenant:
        raise HTTPException(status_code=404, detail="Prestador não encontrado")
    return Tenant(**tenant)


@router.patch("/{tenant_id}", response_model=Tenant)
async def update_tenant(tenant_id: str, data: TenantUpdate):
    tenant = await tenants_collection.find_one({"id": tenant_id})
    if not tenant:
        raise HTTPException(status_code=404, detail="Prestador não encontrado")

    updates = {k: v for k, v in data.dict(exclude_unset=True).items() if v is not None}
    if updates:
        await tenants_collection.update_one({"id": tenant_id}, {"$set": updates})

    updated = await tenants_collection.find_one({"id": tenant_id})
    return Tenant(**updated)
