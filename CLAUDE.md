# NITI-SATHI — Project Reference

AI-powered legal chatbot for Nepali law and governance. Full-stack application: FastAPI backend, Next.js frontend, PostgreSQL + pgvector, Google Gemini LLM, OpenAI embeddings.

---

## Architecture Overview

| Layer        | Stack                                                                 |
|-------------|-----------------------------------------------------------------------|
| Backend      | FastAPI 0.115, Python 3.13, SQLAlchemy 2.0 async + asyncpg, Alembic |
| Frontend     | Next.js 16.1 (App Router), React 19, Tailwind CSS 4, shadcn/ui v4   |
| Database     | PostgreSQL 17 + pgvector (unified relational + vector storage)       |
| LLM          | Google Gemini 2.5 Flash (`google-genai` SDK)                         |
| Embeddings   | OpenAI `text-embedding-3-large` (1024 dims)                         |
| Reranking    | Cohere `rerank-v3.5`                                                 |
| Auth         | Custom JWT (PyJWT + bcrypt), access 15min / refresh 7 days           |
| Streaming    | SSE via `sse-starlette` (backend) → custom `useChat` hook (frontend)|
| Deployment   | Docker Compose (Postgres + backend + frontend + Nginx) on AWS EC2   |

## RAG Pipeline

```
Query → Classify (legal / off_topic)
      → Hybrid Search (BM25 + pgvector cosine, top-20)
      → Cohere Rerank (top-5)
      → Gemini Generate (with context + citations)
      → Stream SSE response
```

---

## Project Structure

### Backend (`backend/`)

```
app/
├── config.py          # Pydantic Settings, env vars
├── database.py        # SQLAlchemy async engine, pgvector init
├── dependencies.py    # get_current_user, get_admin_user
├── main.py            # FastAPI app factory, lifespan, CORS
├── models/            # SQLAlchemy: User, Session, Message, Document, DocumentChunk
├── schemas/           # Pydantic request/response schemas
├── services/          # Business logic: RAG, LLM, vector store, auth, ingestion
├── routers/           # API endpoints: auth, chat, sessions, documents, health
├── prompts/           # LLM prompt templates
└── utils/             # Text extraction, processing, security
```

### Frontend (`frontend/`)

```
src/
├── app/
│   ├── (auth)/        # Login, signup pages
│   ├── (app)/         # Authenticated pages: chat, settings, admin
│   ├── api/chat/      # Next.js API route proxy to backend SSE
│   ├── layout.tsx     # Root layout with providers
│   └── page.tsx       # Landing page
├── components/        # UI components: chat, layout, ui
├── contexts/          # Auth context
├── hooks/             # useChat custom hook
├── lib/               # API client, constants, utils
└── types/             # TypeScript interfaces
```

---

## Development Commands

```bash
# Backend (from project root)
cd backend && uvicorn app.main:app --reload --port 8000

# Frontend (from project root)
cd frontend && npm run dev

# Full stack via Docker
docker compose up --build

# Database migrations
cd backend && alembic upgrade head
cd backend && alembic revision --autogenerate -m "description"

# Tests
cd backend && pytest

# Frontend production build
cd frontend && npm run build
```

---

## Environment Variables

Required in `.env` (never commit):

| Variable           | Purpose                        |
|--------------------|---------------------------------|
| `GOOGLE_API_KEY`   | Gemini LLM access              |
| `OPENAI_API_KEY`   | Embedding generation            |
| `COHERE_API_KEY`   | Reranking                       |
| `DATABASE_URL`     | PostgreSQL connection string    |
| `JWT_SECRET_KEY`   | Token signing                   |
| `POSTGRES_PASSWORD`| Database password               |

---

## Conventions

### Python (Backend)

- Async throughout — all DB operations, HTTP calls, and service methods are async.
- Pydantic for all request/response validation.
- Type hints on every function signature.
- Services use singleton pattern for stateful services; dependency injection for DB sessions.
- Models use UUID primary keys and timezone-aware timestamps.
- API routes are prefixed with `/api`, auth via Bearer JWT.

### TypeScript (Frontend)

- Strict mode enabled.
- Prefer `interface` over `type` for object shapes.
- Functional components only.
- shadcn/ui v4 components live in `src/components/ui/`.

### General

- All API authentication uses Bearer token in the Authorization header.
- SSE streaming: backend sends events via `sse-starlette`, frontend consumes via the custom `useChat` hook in `src/hooks/`.
- The Next.js `/api/chat/` route acts as a proxy to the backend SSE endpoint.

---

## Database

PostgreSQL 17 with the `pgvector` extension handles both relational data and vector similarity search in a single database.

**Core models:**
- `User` — accounts and credentials
- `Session` — chat sessions per user
- `Message` — individual messages within sessions
- `Document` — ingested legal documents (metadata)
- `DocumentChunk` — chunked text with vector embeddings (1024-dim)

Migrations are managed with Alembic. Always run `alembic upgrade head` after pulling changes that touch models.

---

## Docker

`docker-compose.yml` orchestrates four services:
1. **postgres** — PostgreSQL 17 with pgvector
2. **backend** — FastAPI application
3. **frontend** — Next.js application
4. **nginx** — Reverse proxy

For local development with hot-reload, use `docker-compose.dev.yml`.

---

## Common Tasks

**Add a new API endpoint:**
1. Create or update the router in `backend/app/routers/`.
2. Define Pydantic schemas in `backend/app/schemas/`.
3. Implement business logic in `backend/app/services/`.
4. Register the router in `backend/app/main.py` if new.

**Add a new database model:**
1. Define the SQLAlchemy model in `backend/app/models/`.
2. Run `alembic revision --autogenerate -m "add model_name table"`.
3. Run `alembic upgrade head`.

**Add a new frontend page:**
1. Create the route directory under `frontend/src/app/(app)/` for authenticated pages or `(auth)/` for auth pages.
2. Add the `page.tsx` file with a default export.

**Ingest new legal documents:**
Documents are processed through the ingestion service which extracts text, chunks it, generates embeddings via OpenAI, and stores chunks with vectors in the `DocumentChunk` table.
