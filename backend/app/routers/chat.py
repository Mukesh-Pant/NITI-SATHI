import json
import logging
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sse_starlette.sse import EventSourceResponse
from app.database import get_db, AsyncSessionLocal
from app.models.user import User
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.rag_service import get_rag_service
from app.services import session_service
from app.dependencies import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Send a message and get a response (non-streaming)."""
    # Get or create session
    if request.session_id:
        session = await session_service.get_session_with_messages(
            request.session_id, user.id, db
        )
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Session not found"
            )
    else:
        session = await session_service.create_session(user.id, request.language, db)

    # Save user message
    await session_service.add_message(
        session_id=session.id,
        role="user",
        content=request.message,
        language=request.language,
        citations=None,
        db=db,
    )

    # Auto-title session from first message
    await session_service.auto_title_session(session, request.message, db)

    # Get chat history
    chat_history = await session_service.get_chat_history(session.id, db)

    # Generate response via RAG pipeline (pass db for pgvector queries)
    rag_service = get_rag_service()
    response_text, citations = await rag_service.answer(
        query=request.message,
        chat_history=chat_history[:-1],
        language=request.language,
        db=db,
    )

    # Save assistant message
    await session_service.add_message(
        session_id=session.id,
        role="assistant",
        content=response_text,
        language=request.language,
        citations=citations,
        db=db,
    )

    return ChatResponse(
        response=response_text,
        citations=citations,
        session_id=session.id,
    )


@router.get("/stream")
async def chat_stream(
    request: Request,
    session_id: str | None = None,
    message: str = "",
    language: str = "en",
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Stream a chat response via Server-Sent Events."""
    if not message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Message is required"
        )

    # Get or create session
    if session_id:
        session = await session_service.get_session_with_messages(session_id, user.id, db)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Session not found"
            )
    else:
        session = await session_service.create_session(user.id, language, db)

    # Save user message
    await session_service.add_message(
        session_id=session.id,
        role="user",
        content=message,
        language=language,
        citations=None,
        db=db,
    )
    await session_service.auto_title_session(session, message, db)

    # Get chat history
    chat_history = await session_service.get_chat_history(session.id, db)

    # Commit so the streaming generator can open a fresh session
    await db.commit()

    async def event_generator():
        rag_service = get_rag_service()
        full_response = ""
        final_citations = []

        try:
            # Open a new session for the RAG pipeline (pgvector queries)
            async with AsyncSessionLocal() as rag_db:
                async for event in rag_service.answer_stream(
                    query=message,
                    chat_history=chat_history[:-1],
                    language=language,
                    db=rag_db,
                ):
                    if await request.is_disconnected():
                        break

                    if event["type"] == "token":
                        full_response += event["data"]
                        yield {"event": "token", "data": json.dumps({"token": event["data"]})}

                    elif event["type"] == "citations":
                        final_citations = event["data"]
                        yield {
                            "event": "citations",
                            "data": json.dumps({"citations": final_citations}),
                        }

                    elif event["type"] == "done":
                        yield {
                            "event": "done",
                            "data": json.dumps({"session_id": session.id}),
                        }

            # Save assistant message after streaming completes
            from app.schemas.chat import Citation
            citations_objs = [Citation(**c) for c in final_citations] if final_citations else None

            async with AsyncSessionLocal() as save_db:
                await session_service.add_message(
                    session_id=session.id,
                    role="assistant",
                    content=full_response,
                    language=language,
                    citations=citations_objs,
                    db=save_db,
                )
                await save_db.commit()

        except Exception as e:
            logger.error(f"Streaming error: {e}")
            yield {"event": "error", "data": json.dumps({"message": str(e)})}

    return EventSourceResponse(event_generator())
