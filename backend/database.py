import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "itatech_os")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Coleções
tenants_collection = db["tenants"]
customers_collection = db["customers"]
equipment_collection = db["equipment"]
service_orders_collection = db["service_orders"]
status_history_collection = db["status_history"]
payments_collection = db["payments"]
