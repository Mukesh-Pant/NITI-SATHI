from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services import vector_store_service

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """Health check endpoint."""
    try:
        stats = await vector_store_service.get_collection_stats(db)
        vector_status = "ready"
    except Exception:
        stats = {}
        vector_status = "unavailable"

    return {
        "status": "ok",
        "vector_store": vector_status,
        "collection_stats": stats,
    }
