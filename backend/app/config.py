from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    # Google Gemini (LLM)
    GOOGLE_API_KEY: str = ""

    # OpenAI (Embeddings only)
    OPENAI_API_KEY: str = ""

    # Cohere (Reranking)
    COHERE_API_KEY: str = ""

    # Database (PostgreSQL + pgvector)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/nitisathi"

    # JWT
    JWT_SECRET_KEY: str = "change-this-secret-key-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Models
    EMBEDDING_MODEL: str = "text-embedding-3-large"
    EMBEDDING_DIMENSIONS: int = 1024
    LLM_MODEL: str = "gemini-2.5-flash"

    # RAG Parameters
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    RETRIEVAL_INITIAL_K: int = 20
    RERANK_TOP_K: int = 5
    SCORE_THRESHOLD: float = 0.3
    BM25_WEIGHT: float = 0.3
    VECTOR_WEIGHT: float = 0.7

    # Server
    CORS_ORIGINS: str = '["http://localhost:3000"]'
    UPLOAD_DIR: str = "./data/legal_documents"
    MAX_UPLOAD_SIZE_MB: int = 50

    @property
    def cors_origins_list(self) -> List[str]:
        return json.loads(self.CORS_ORIGINS)

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
