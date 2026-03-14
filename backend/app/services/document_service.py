import os
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.document import Document
from app.services import vector_store_service
from app.services.ingestion_service import get_ingestion_service

logger = logging.getLogger(__name__)


async def list_documents(db: AsyncSession) -> list[Document]:
    stmt = select(Document).order_by(Document.uploaded_at.desc())
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def get_document(document_id: str, db: AsyncSession) -> Document | None:
    stmt = select(Document).where(Document.id == document_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def create_document_record(
    filename: str,
    file_path: str,
    file_type: str,
    file_size: int,
    uploaded_by: str | None,
    db: AsyncSession,
) -> Document:
    doc = Document(
        filename=filename,
        file_path=file_path,
        file_type=file_type,
        file_size=file_size,
        uploaded_by=uploaded_by,
        status="processing",
    )
    db.add(doc)
    await db.flush()
    return doc


async def process_document(document_id: str, file_path: str, filename: str, db: AsyncSession):
    """Process document in background: ingest and update status."""
    stmt = select(Document).where(Document.id == document_id)
    result = await db.execute(stmt)
    doc = result.scalar_one_or_none()
    if not doc:
        return

    try:
        ingestion_service = get_ingestion_service()
        chunk_count = await ingestion_service.ingest_document(
            file_path, document_id, filename, db
        )
        doc.chunk_count = chunk_count
        doc.status = "ready"
        logger.info(f"Document '{filename}' processed successfully: {chunk_count} chunks")
    except Exception as e:
        doc.status = "error"
        doc.error_message = str(e)
        logger.error(f"Failed to process document '{filename}': {e}")

    await db.commit()


async def delete_document(document_id: str, db: AsyncSession) -> bool:
    stmt = select(Document).where(Document.id == document_id)
    result = await db.execute(stmt)
    doc = result.scalar_one_or_none()

    if not doc:
        return False

    # Remove chunks from PostgreSQL (cascade handles this, but explicit is clearer)
    await vector_store_service.delete_by_document_id(db, document_id)

    # Remove file from disk
    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)

    # Remove DB record
    await db.delete(doc)
    return True
