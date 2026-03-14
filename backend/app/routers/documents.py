import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db, AsyncSessionLocal
from app.models.user import User
from app.schemas.document import DocumentResponse, DocumentUploadResponse
from app.services import document_service
from app.dependencies import get_admin_user
from app.config import settings

router = APIRouter(prefix="/documents", tags=["documents"])

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc", ".html", ".htm"}


async def _process_in_background(document_id: str, file_path: str, filename: str):
    """Background task to process uploaded document."""
    async with AsyncSessionLocal() as db:
        await document_service.process_document(document_id, file_path, filename, db)


@router.get("", response_model=list[DocumentResponse])
async def list_documents(
    user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """List all uploaded documents (admin only)."""
    docs = await document_service.list_documents(db)
    return [DocumentResponse.model_validate(d) for d in docs]


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload a legal document for processing (admin only)."""
    # Validate file extension
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: {ext}. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # Validate file size
    content = await file.read()
    file_size = len(content)
    max_size = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if file_size > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: {settings.MAX_UPLOAD_SIZE_MB}MB",
        )

    # Save file to disk
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    safe_filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)

    with open(file_path, "wb") as f:
        f.write(content)

    # Create document record
    doc = await document_service.create_document_record(
        filename=file.filename or safe_filename,
        file_path=file_path,
        file_type=ext.lstrip("."),
        file_size=file_size,
        uploaded_by=user.id,
        db=db,
    )

    # Process document in background
    background_tasks.add_task(_process_in_background, doc.id, file_path, file.filename or safe_filename)

    return DocumentUploadResponse(
        id=doc.id,
        filename=doc.filename,
        status="processing",
        message="Document uploaded and is being processed. It will be available for queries shortly.",
    )


@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a document and its vectors (admin only)."""
    deleted = await document_service.delete_document(document_id, db)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return {"message": "Document deleted", "id": document_id}
