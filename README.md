<p align="center">
  <h1 align="center">NITI-SATHI (नीति-साथी)</h1>
  <p align="center">
    <strong>AI-Powered Legal Chatbot for Nepali Law and Governance</strong>
  </p>
  <p align="center">
    <em>Your intelligent companion for understanding Nepali legal documents</em>
  </p>
</p>

![Python](https://img.shields.io/badge/Python-3.13+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.1-000000?style=for-the-badge&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

---

**NITI-SATHI** is a Retrieval-Augmented Generation (RAG) legal chatbot that answers questions about Nepali law with source citations. Built as an academic minor project at **Far Western University, Nepal**, it combines hybrid search, neural reranking, and large language models to deliver accurate, citation-grounded legal information in both English and Nepali (Devanagari).

> **नीति-साथी** — "Policy Companion" in Nepali — bridges the gap between complex legal texts and everyday understanding.

---

## Features

- [x] **Hybrid Search** — BM25 keyword + vector semantic search in a single PostgreSQL query
- [x] **Neural Reranking** — Cohere rerank-v3.5 selects the most relevant passages from initial retrieval
- [x] **Real-Time Streaming** — Server-Sent Events (SSE) for token-by-token response streaming
- [x] **Bilingual Support** — Full English and Nepali (Devanagari) language support
- [x] **Premium Chat UI** — Sidebar with session history, citation cards, markdown rendering
- [x] **Citation-Grounded Responses** — Every answer includes source document references with numbered source cards
- [x] **Admin Document Management** — Drag-and-drop upload for PDF, DOCX, and HTML legal documents with indexing status
- [x] **User Authentication** — Signup/login with JWT (access + refresh tokens)
- [x] **Query Classification** — Automatic detection of legal vs. non-legal queries
- [x] **Dark/Light Theme** — Token-based theme system with `data-theme` attribute switching
- [x] **Landing Page** — Hero, features, how-it-works, sample Q&A, stats, CTA sections with scroll reveals
- [x] **Static Pages** — Pricing, Docs, About, Privacy pages

---

## Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                        Nginx (Port 80)                          │
│                      Reverse Proxy + SSE                        │
└──────────┬──────────────────────────────────┬───────────────────┘
           │                                  │
           ▼                                  ▼
┌─────────────────────┐          ┌─────────────────────────┐
│   Next.js Frontend  │          │    FastAPI Backend       │
│     (Port 3000)     │          │      (Port 8000)        │
│                     │          │                         │
│  - React 19         │  HTTP/   │  - Auth (JWT + bcrypt)  │
│  - TypeScript       │  SSE     │  - RAG Pipeline         │
│  - Tailwind CSS 4   │◄────────►│  - Document Ingestion   │
│  - shadcn/ui v4     │          │  - Query Classification │
│  - framer-motion    │          │  - Streaming (SSE)      │
│  - Newsreader font  │          │  - Hybrid Search        │
└─────────────────────┘          └───────────┬─────────────┘
                                             │
                          ┌──────────────────┼──────────────────┐
                          │                  │                  │
                          ▼                  ▼                  ▼
                 ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
                 │  PostgreSQL  │  │   Google AI   │  │   OpenAI     │
                 │  + pgvector  │  │  Gemini 2.5   │  │  Embeddings  │
                 │              │  │   Flash       │  │  text-emb-   │
                 │ - Users      │  │               │  │  3-large     │
                 │ - Sessions   │  │  (Generation) │  │  (1024 dim)  │
                 │ - Messages   │  └──────────────┘  └──────────────┘
                 │ - Documents  │           │
                 │ - Chunks     │  ┌──────────────┐
                 │ - Vectors    │  │   Cohere     │
                 │ - BM25 Index │  │  rerank-v3.5 │
                 └──────────────┘  │ (Reranking)  │
                                   └──────────────┘
```

### RAG Pipeline

```text
User Query
    │
    ▼
┌─────────────────┐
│ Query            │
│ Classification   │──── Non-legal? ──► Direct LLM response
│ (Gemini)         │
└────────┬────────┘
         │ Legal query
         ▼
┌─────────────────┐
│ Hybrid Search    │
│ BM25 (0.3) +    │──── Retrieve top-20 candidates
│ Vector (0.7)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cohere Reranking │──── Select top-5 most relevant
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ LLM Generation  │──── Stream citation-grounded
│ (Gemini 2.5     │     response via SSE
│  Flash)         │
└─────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | FastAPI 0.115 (Python 3.13), SQLAlchemy 2.0 async, Alembic |
| **Frontend** | Next.js 16.1 (App Router), React 19, TypeScript 5, Tailwind CSS 4, shadcn/ui v4 |
| **Fonts** | Geist, Geist Mono, Newsreader (display), Noto Serif Devanagari |
| **Animation** | framer-motion (scroll reveals), CSS keyframes |
| **Icons** | lucide-react |
| **Theme** | next-themes with `data-theme` attribute tokens |
| **Database** | PostgreSQL 17 + pgvector (relational + vector in one DB) |
| **LLM** | Google Gemini 2.5 Flash |
| **Embeddings** | OpenAI text-embedding-3-large (1024 dimensions) |
| **Reranking** | Cohere rerank-v3.5 |
| **Auth** | Custom JWT (bcrypt + PyJWT), access 15 min / refresh 7 days |
| **Streaming** | SSE via sse-starlette (backend) → custom `useChat` hook (frontend) |
| **Deployment** | Docker Compose on AWS EC2 with Nginx reverse proxy |
| **Doc Parsing** | PyMuPDF (PDF), python-docx (DOCX), BeautifulSoup4 (HTML) |

---

## Project Structure

```text
NITI-SATHI/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application entry point
│   │   ├── config.py               # Pydantic settings
│   │   ├── database.py             # Async SQLAlchemy + pgvector init
│   │   ├── dependencies.py         # Dependency injection
│   │   ├── models/                 # SQLAlchemy ORM models
│   │   ├── routers/                # API route handlers (auth, chat, sessions, documents, health)
│   │   ├── schemas/                # Pydantic request/response schemas
│   │   ├── services/               # Business logic (RAG, LLM, auth, ingestion, vector store)
│   │   ├── prompts/                # LLM prompt templates
│   │   └── utils/                  # Helpers (security, text extraction, processing)
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router pages
│   │   │   ├── (auth)/             # Login + signup
│   │   │   ├── (app)/              # Authenticated shell (chat, settings, admin)
│   │   │   ├── pricing/            # Pricing page
│   │   │   ├── docs/               # Documentation page
│   │   │   ├── about/              # About page
│   │   │   ├── privacy/            # Privacy + disclaimer page
│   │   │   ├── api/chat/           # SSE proxy route
│   │   │   ├── globals.css         # Design tokens, utility classes
│   │   │   ├── layout.tsx          # Root layout
│   │   │   └── page.tsx            # Landing page
│   │   ├── components/
│   │   │   ├── layout/             # Header, Footer, Sidebar, Reveal, ThemeProvider
│   │   │   ├── landing/            # Hero, Features, HowItWorks, SampleQA, Stats, CTA
│   │   │   ├── chat/               # ChatContainer, WelcomeScreen, MessageBubble, MessageInput
│   │   │   ├── auth/               # AuthPage (shared login/signup)
│   │   │   └── ui/                 # Logo + shadcn/ui components
│   │   ├── contexts/               # AuthContext, SidebarContext
│   │   ├── hooks/                  # useChat SSE hook
│   │   ├── lib/                    # Typed API client
│   │   └── types/                  # Shared TypeScript interfaces
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── nginx/
│   ├── nginx.conf
│   └── Dockerfile
├── data/
│   └── legal_documents/            # Uploaded legal document storage
├── docker-compose.yml              # Production orchestration
├── docker-compose.dev.yml          # Development overrides
├── Makefile
├── .env.example
└── .gitignore
```

---

## Prerequisites

- **Python** 3.13+
- **Node.js** 20+
- **PostgreSQL** 17 with [pgvector](https://github.com/pgvector/pgvector) (or use Docker)
- **Docker** and **Docker Compose** (recommended)
- **API Keys:** Google AI (Gemini), OpenAI (embeddings), Cohere (reranking)

---

## Quick Start

### Using Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/Mukesh-Pant/NITI-SATHI.git
cd NITI-SATHI

# 2. Configure environment
cp .env.example .env
# Edit .env with your API keys and secrets

# 3. Build and start all services
docker compose up --build

# 4. Visit
# Frontend: http://localhost
# API Docs: http://localhost/api/docs
```

### Local Development

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev                     # http://localhost:3000
```

### Makefile

```bash
make dev-backend    # Start backend with hot reload
make dev-frontend   # Start frontend dev server
make build          # Build Docker images
make deploy         # Start all containers (detached)
make stop           # Stop all containers
make logs           # Tail container logs
```

---

## Environment Variables

Copy `.env.example` to `.env`:

| Variable | Description |
|----------|-------------|
| `GOOGLE_API_KEY` | Google AI API key (Gemini 2.5 Flash) |
| `OPENAI_API_KEY` | OpenAI API key (text-embedding-3-large) |
| `COHERE_API_KEY` | Cohere API key (rerank-v3.5) |
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `JWT_SECRET_KEY` | Secret for JWT signing |
| `LLM_MODEL` | LLM model name (`gemini-2.5-flash`) |
| `EMBEDDING_MODEL` | Embedding model (`text-embedding-3-large`) |
| `EMBEDDING_DIMENSIONS` | Vector dimensions (`1024`) |
| `CHUNK_SIZE` | Text chunk size in characters (`1000`) |
| `CHUNK_OVERLAP` | Overlap between chunks (`200`) |
| `BM25_WEIGHT` | BM25 search weight (`0.3`) |
| `VECTOR_WEIGHT` | Vector search weight (`0.7`) |
| `RETRIEVAL_INITIAL_K` | Initial hybrid search candidates (`20`) |
| `RERANK_TOP_K` | Final passages after reranking (`5`) |

---

## API Documentation

With the backend running:

- **Swagger UI:** `http://localhost:8000/docs` (or `http://localhost/api/docs` via Nginx)
- **ReDoc:** `http://localhost:8000/redoc`

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate and receive JWT tokens |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `POST` | `/api/chat` | Send a message, receive streamed SSE response |
| `GET` | `/api/sessions` | List user's chat sessions |
| `GET` | `/api/sessions/{id}/messages` | Get messages for a session |
| `POST` | `/api/documents/upload` | Upload a legal document (admin only) |
| `GET` | `/api/documents` | List all ingested documents |
| `GET` | `/api/health` | Health check |

---

## Team

| Role | Name |
| --- | --- |
| **Developer** | Mukesh Pant |
| **Team Size** | 4 students |
| **Supervisor** | Er. Rohit Kumar Bisht |
| **Institution** | Far Western University, School of Engineering |
| **Academic Year** | 2024–2025 |

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with dedication at <strong>Far Western University, Nepal</strong>
</p>
