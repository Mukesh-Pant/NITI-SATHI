import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete
from app.models.session import Session
from app.models.message import Message
from app.schemas.chat import Citation


async def create_session(user_id: str, language: str, db: AsyncSession) -> Session:
    session = Session(user_id=user_id, language=language)
    db.add(session)
    await db.flush()
    return session


async def get_user_sessions(user_id: str, db: AsyncSession) -> list[dict]:
    """Get all sessions for a user with message counts."""
    stmt = (
        select(
            Session,
            func.count(Message.id).label("message_count"),
        )
        .outerjoin(Message, Message.session_id == Session.id)
        .where(Session.user_id == user_id)
        .group_by(Session.id)
        .order_by(Session.updated_at.desc())
    )
    result = await db.execute(stmt)
    rows = result.all()

    sessions = []
    for row in rows:
        session = row[0]
        count = row[1]
        sessions.append({
            "id": session.id,
            "title": session.title,
            "language": session.language,
            "created_at": session.created_at,
            "updated_at": session.updated_at,
            "message_count": count,
        })
    return sessions


async def get_session_with_messages(
    session_id: str, user_id: str, db: AsyncSession
) -> Session | None:
    stmt = select(Session).where(Session.id == session_id, Session.user_id == user_id)
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()

    if session:
        # Load messages
        msg_stmt = (
            select(Message)
            .where(Message.session_id == session_id)
            .order_by(Message.created_at)
        )
        msg_result = await db.execute(msg_stmt)
        session.messages = list(msg_result.scalars().all())

    return session


async def update_session_title(
    session_id: str, user_id: str, title: str, db: AsyncSession
) -> Session | None:
    stmt = select(Session).where(Session.id == session_id, Session.user_id == user_id)
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()
    if session:
        session.title = title
    return session


async def delete_session(session_id: str, user_id: str, db: AsyncSession) -> bool:
    stmt = select(Session).where(Session.id == session_id, Session.user_id == user_id)
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()
    if session:
        await db.delete(session)
        return True
    return False


async def add_message(
    session_id: str,
    role: str,
    content: str,
    language: str,
    citations: list[Citation] | None,
    db: AsyncSession,
) -> Message:
    citations_json = None
    if citations:
        citations_json = json.dumps([c.model_dump() for c in citations])

    message = Message(
        session_id=session_id,
        role=role,
        content=content,
        language=language,
        citations=citations_json,
    )
    db.add(message)
    await db.flush()
    return message


async def get_chat_history(session_id: str, db: AsyncSession) -> list[dict]:
    """Get formatted chat history for the RAG pipeline."""
    stmt = (
        select(Message)
        .where(Message.session_id == session_id)
        .order_by(Message.created_at)
    )
    result = await db.execute(stmt)
    messages = result.scalars().all()

    return [{"role": msg.role, "content": msg.content} for msg in messages]


async def auto_title_session(session: Session, first_message: str, db: AsyncSession):
    """Set session title from the first message (truncated)."""
    if not session.title:
        session.title = first_message[:80].strip()
        if len(first_message) > 80:
            session.title += "..."
