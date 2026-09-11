from fastapi import APIRouter, HTTPException
from models.schemas import TenantLogin, TokenResponse
from database import tenants_collection
from auth import verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
async def login(data: TenantLogin):
    tenant = await tenants_collection.find_one({"subdominio": data.subdominio})
    if not tenant or not verify_password(data.senha, tenant.get("senha_hash")):
        raise HTTPException(status_code=401, detail="Subdomínio ou senha incorretos")

    if not tenant.get("ativo", True):
        raise HTTPException(status_code=403, detail="Esta oficina está desativada")

    token = create_access_token(tenant["id"])
    return TokenResponse(
        access_token=token, tenant_id=tenant["id"], tenant_nome=tenant["nome"]
    )
