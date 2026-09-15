from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from routers import tenants, customers, service_orders, payments, stock, auth
from database import login_attempts_collection

app = FastAPI(title="iTATech OS - Ordem de Serviço")

# CORS: antes o padrão era ".*" (liberado pra qualquer site) quando a variável
# não estava configurada. Agora, sem configuração explícita, só o domínio oficial
# do itatech-os é aceito. Ajuste CORS_ORIGIN_REGEX no Render se usar outro domínio.
CORS_ORIGIN_REGEX = os.environ.get(
    "CORS_ORIGIN_REGEX", r"^https://([a-z0-9-]+\.)?itatech-os\.com\.br$"
)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tenants.router)
app.include_router(auth.router)
app.include_router(customers.router)
app.include_router(customers.equipment_router)
app.include_router(service_orders.router)
app.include_router(service_orders.public_router)
app.include_router(payments.router)
app.include_router(stock.router)


@app.on_event("startup")
async def startup():
    await login_attempts_collection.create_index("criado_em", expireAfterSeconds=900)


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "itatech-os"}
