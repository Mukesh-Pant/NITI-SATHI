import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, init_pgvector
from app.routers import auth, chat, sessions, documents, health

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup
    logger.info("Starting NITI-SATHI API...")

    # Initialize pgvector extension
    await init_pgvector()
    logger.info("pgvector extension initialized.")

    yield

    # Shutdown
    await engine.dispose()
    logger.info("NITI-SATHI API shut down.")


app = FastAPI(
    title="NITI-SATHI API",
    description="AI Chatbot for Nepali Law and Governance",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(sessions.router, prefix="/api")
app.include_router(documents.router, prefix="/api")


@app.get("/")
async def root():
    return {
        "name": "NITI-SATHI",
        "description": "AI Chatbot for Nepali Law and Governance",
        "docs": "/docs",
    }
