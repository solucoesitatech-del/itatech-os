import os
import time
import bcrypt
import jwt
from fastapi import Header, HTTPException

JWT_SECRET = os.environ.get("JWT_SECRET", "dev-secret-troque-em-producao")
JWT_ALGORITHM = "HS256"
TOKEN_EXP_SECONDS = 60 * 60 * 24 * 30  # 30 dias

SUPERADMIN_KEY = os.environ.get("SUPERADMIN_KEY")


def hash_password(senha: str) -> str:
    return bcrypt.hashpw(senha.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(senha: str, senha_hash: str | None) -> bool:
    if not senha_hash:
        return False
    try:
        return bcrypt.checkpw(senha.encode("utf-8"), senha_hash.encode("utf-8"))
    except ValueError:
        return False


def create_access_token(tenant_id: str) -> str:
    payload = {"tenant_id": tenant_id, "exp": int(time.time()) + TOKEN_EXP_SECONDS}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_tenant_id(authorization: str | None = Header(None)) -> str:
    """Extrai e valida o token Bearer enviado pelo painel da oficina."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Não autenticado")

    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sessão expirada, faça login novamente")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")

    tenant_id = payload.get("tenant_id")
    if not tenant_id:
        raise HTTPException(status_code=401, detail="Token inválido")
    return tenant_id


def check_tenant_match(current_tenant_id: str, tenant_id: str):
    """Garante que o token pertence exatamente à oficina que está sendo acessada."""
    if current_tenant_id != tenant_id:
        raise HTTPException(status_code=403, detail="Acesso negado a esta oficina")


async def require_superadmin(x_superadmin_key: str | None = Header(None)):
    """Protege as rotas usadas pelo painel do dono (cadastro de oficinas)."""
    if not SUPERADMIN_KEY or x_superadmin_key != SUPERADMIN_KEY:
        raise HTTPException(status_code=403, detail="Acesso negado")
