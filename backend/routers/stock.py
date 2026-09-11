from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models.schemas import StockItem, StockItemCreate, StockItemUpdate
from database import stock_items_collection
from auth import get_current_tenant_id, check_tenant_match

router = APIRouter(prefix="/api/stock", tags=["stock"])


@router.post("/", response_model=StockItem)
async def create_item(
    data: StockItemCreate, current_tenant_id: str = Depends(get_current_tenant_id)
):
    check_tenant_match(current_tenant_id, data.tenant_id)
    item = StockItem(**data.dict())
    await stock_items_collection.insert_one(item.dict())
    return item


@router.get("/tenant/{tenant_id}", response_model=List[StockItem])
async def list_items(
    tenant_id: str, current_tenant_id: str = Depends(get_current_tenant_id)
):
    check_tenant_match(current_tenant_id, tenant_id)
    items = await stock_items_collection.find({"tenant_id": tenant_id}).sort(
        "nome", 1
    ).to_list(1000)
    return [StockItem(**i) for i in items]


@router.patch("/{item_id}", response_model=StockItem)
async def update_item(
    item_id: str,
    data: StockItemUpdate,
    current_tenant_id: str = Depends(get_current_tenant_id),
):
    item = await stock_items_collection.find_one({"id": item_id})
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado")
    check_tenant_match(current_tenant_id, item["tenant_id"])

    updates = {k: v for k, v in data.dict(exclude_unset=True).items() if v is not None}
    if updates:
        await stock_items_collection.update_one({"id": item_id}, {"$set": updates})

    updated = await stock_items_collection.find_one({"id": item_id})
    return StockItem(**updated)


@router.delete("/{item_id}")
async def delete_item(
    item_id: str, current_tenant_id: str = Depends(get_current_tenant_id)
):
    item = await stock_items_collection.find_one({"id": item_id})
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado")
    check_tenant_match(current_tenant_id, item["tenant_id"])

    await stock_items_collection.delete_one({"id": item_id})
    return {"ok": True}
