from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models.schemas import (
    Tenant,
    TenantPublic,
    TenantCreate,
    TenantUpdate,
    TenantSetPassword,
)
from database import tenants_collection
from auth import (
    hash_password,
    get_current_tenant_id,
    check_tenant_match,
    require_superadmin,
)

router = APIRouter(prefix="/api/tenants", tags=["tenants"])


@router.post("/", response_model=TenantPublic, dependencies=[Depends(require_superadmin)])
async def create_tenant(data: TenantCreate):
    existing = await tenants_collection.find_one({"subdominio": data.subdominio})
    if existing:
        raise HTTPException(status_code=400, detail="Subdomínio já está em uso")

    payload = data.dict()
    senha = payload.pop("senha")
    tenant = Tenant(**payload, senha_hash=hash_password(senha))
    await tenants_collection.insert_one(tenant.dict())
    return TenantPublic(**tenant.dict())


@router.get("/", response_model=List[TenantPublic], dependencies=[Depends(require_superadmin)])
async def list_tenants():
    tenants = await tenants_collection.find().to_list(1000)
    return [TenantPublic(**t) for t in tenants]


@router.get("/{tenant_id}", response_model=TenantPublic)
async def get_tenant(tenant_id: str, current_tenant_id: str = Depends(get_current_tenant_id)):
    check_tenant_match(current_tenant_id, tenant_id)
    tenant = await tenants_collection.find_one({"id": tenant_id})
    if not tenant:
        raise HTTPException(status_code=404, detail="Prestador não encontrado")
    return TenantPublic(**tenant)


@router.get("/subdominio/{subdominio}", response_model=TenantPublic)
async def get_tenant_by_subdomain(subdominio: str):
    tenant = await tenants_collection.find_one({"subdominio": subdominio})
    if not tenant:
        raise HTTPException(status_code=404, detail="Prestador não encontrado")
    return TenantPublic(**tenant)


@router.patch("/{tenant_id}", response_model=TenantPublic)
async def update_tenant(
    tenant_id: str,
    data: TenantUpdate,
    current_tenant_id: str = Depends(get_current_tenant_id),
):
    check_tenant_match(current_tenant_id, tenant_id)
    tenant = await tenants_collection.find_one({"id": tenant_id})
    if not tenant:
        raise HTTPException(status_code=404, detail="Prestador não encontrado")

    updates = {k: v for k, v in data.dict(exclude_unset=True).items() if v is not None}
    if updates:
        await tenants_collection.update_one({"id": tenant_id}, {"$set": updates})

    updated = await tenants_collection.find_one({"id": tenant_id})
    return TenantPublic(**updated)


@router.patch("/{tenant_id}/senha")
async def change_own_password(
    tenant_id: str,
    data: TenantSetPassword,
    current_tenant_id: str = Depends(get_current_tenant_id),
):
    """Troca de senha feita pela própria oficina, já logada, em Configurações."""
    check_tenant_match(current_tenant_id, tenant_id)
    tenant = await tenants_collection.find_one({"id": tenant_id})
    if not tenant:
        raise HTTPException(status_code=404, detail="Prestador não encontrado")

    await tenants_collection.update_one(
        {"id": tenant_id}, {"$set": {"senha_hash": hash_password(data.senha)}}
    )
    return {"ok": True}


@router.patch(
    "/{tenant_id}/redefinir-senha",
    dependencies=[Depends(require_superadmin)],
)
async def reset_password(tenant_id: str, data: TenantSetPassword):
    """Redefinição de senha feita pelo dono do sistema (painel /superadmin)."""
    tenant = await tenants_collection.find_one({"id": tenant_id})
    if not tenant:
        raise HTTPException(status_code=404, detail="Prestador não encontrado")

    await tenants_collection.update_one(
        {"id": tenant_id}, {"$set": {"senha_hash": hash_password(data.senha)}}
    )
    return {"ok": True}
