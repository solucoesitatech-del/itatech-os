from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, Request
from models.schemas import TenantLogin, TokenResponse
from database import tenants_collection, login_attempts_collection
from auth import verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

MAX_TENTATIVAS = 5
JANELA_BLOQUEIO_MINUTOS = 15


@router.post("/login", response_model=TokenResponse)
async def login(data: TenantLogin, request: Request):
    forwarded = request.headers.get("x-forwarded-for", "")
    client_ip = forwarded.split(",")[0].strip() if forwarded else (request.client.host if request.client else "unknown")
    key = f"{client_ip}:{data.subdominio}"
    cutoff = datetime.now(timezone.utc) - timedelta(minutes=JANELA_BLOQUEIO_MINUTOS)

    tentativas_recentes = await login_attempts_collection.count_documents(
        {"key": key, "criado_em": {"$gte": cutoff}}
    )
    if tentativas_recentes >= MAX_TENTATIVAS:
        raise HTTPException(status_code=429, detail="Muitas tentativas. Aguarde 15 minutos e tente novamente.")

    tenant = await tenants_collection.find_one({"subdominio": data.subdominio})
    if not tenant or not verify_password(data.senha, tenant.get("senha_hash")):
        await login_attempts_collection.insert_one({"key": key, "criado_em": datetime.now(timezone.utc)})
        raise HTTPException(status_code=401, detail="Subdomínio ou senha incorretos")

    if not tenant.get("ativo", True):
        raise HTTPException(status_code=403, detail="Esta oficina está desativada")

    await login_attempts_collection.delete_many({"key": key})
    token = create_access_token(tenant["id"])
    return TokenResponse(
        access_token=token, tenant_id=tenant["id"], tenant_nome=tenant["nome"]
    )
