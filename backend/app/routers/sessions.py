from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.schemas.session import SessionCreate, SessionUpdate, SessionResponse, SessionDetailResponse
from app.schemas.chat import MessageResponse, Citation
from app.services import session_service
from app.dependencies import get_current_user
import json

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.get("", response_model=list[SessionResponse])
async def list_sessions(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all sessions for the current user."""
    sessions = await session_service.get_user_sessions(user.id, db)
    return sessions


@router.post("", response_model=SessionResponse)
async def create_session(
    request: SessionCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new chat session."""
    session = await session_service.create_session(user.id, request.language, db)
    return SessionResponse(
        id=session.id,
        title=session.title,
        language=session.language,
        created_at=session.created_at,
        updated_at=session.updated_at,
        message_count=0,
    )


@router.get("/{session_id}", response_model=SessionDetailResponse)
async def get_session(
    session_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a session with all its messages."""
    session = await session_service.get_session_with_messages(session_id, user.id, db)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")

    messages = []
    for msg in session.messages:
        citations = []
        if msg.citations:
            try:
                citations_data = json.loads(msg.citations)
                citations = [Citation(**c) for c in citations_data]
            except (json.JSONDecodeError, TypeError):
                pass
        messages.append(
            MessageResponse(
                id=msg.id,
                role=msg.role,
                content=msg.content,
                citations=citations,
                language=msg.language,
                created_at=msg.created_at,
            )
        )

    return SessionDetailResponse(
        id=session.id,
        title=session.title,
        language=session.language,
        created_at=session.created_at,
        updated_at=session.updated_at,
        messages=messages,
    )


@router.put("/{session_id}", response_model=SessionResponse)
async def update_session(
    session_id: str,
    request: SessionUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update session title."""
    session = await session_service.update_session_title(
        session_id, user.id, request.title, db
    )
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    return SessionResponse(
        id=session.id,
        title=session.title,
        language=session.language,
        created_at=session.created_at,
        updated_at=session.updated_at,
    )


@router.delete("/{session_id}")
async def delete_session_endpoint(
    session_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a session and all its messages."""
    deleted = await session_service.delete_session(session_id, user.id, db)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    return {"message": "Session deleted", "id": session_id}
