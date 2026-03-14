from pydantic import BaseModel, Field
from datetime import datetime


class Citation(BaseModel):
    document_name: str
    chunk_text: str
    article_section: str | None = None
    page_number: int | None = None
    relevance_score: float


class ChatRequest(BaseModel):
    session_id: str | None = None
    message: str = Field(min_length=1, max_length=5000)
    language: str = Field(default="en", pattern="^(en|ne)$")


class ChatResponse(BaseModel):
    response: str
    citations: list[Citation] = []
    session_id: str


class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    citations: list[Citation] = []
    language: str
    created_at: datetime

    model_config = {"from_attributes": True}
