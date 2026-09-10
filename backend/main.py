from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from routers import tenants, customers, service_orders, payments

app = FastAPI(title="iTATech OS - Ordem de Serviço")

# CORS liberado para os subdomínios de cada tenant (ajustar em produção)
CORS_ORIGIN_REGEX = os.environ.get("CORS_ORIGIN_REGEX", ".*")
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tenants.router)
app.include_router(customers.router)
app.include_router(customers.equipment_router)
app.include_router(service_orders.router)
app.include_router(service_orders.public_router)
app.include_router(payments.router)


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "itatech-os"}
