<p align="center">
  <h1 align="center">NITI-SATHI (नीति-साथी)</h1>
  <p align="center">
    <strong>AI-Powered Legal Chatbot for Nepali Law and Governance</strong>
  </p>
  <p align="center">
    <em>Your intelligent companion for understanding Nepali legal documents</em>
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.13+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

---

**NITI-SATHI** is a Retrieval-Augmented Generation (RAG) legal chatbot that answers questions about Nepali law with source citations. Built as an academic minor project at **Far Western University, Nepal**, it combines hybrid search, neural reranking, and large language models to deliver accurate, citation-grounded legal information in both English and Nepali (Devanagari).

> **नीति-साथी** -- "Policy Companion" in Nepali -- bridges the gap between complex legal texts and everyday understanding.

---

## Features

- [x] **Hybrid Search** -- BM25 keyword + vector semantic search in a single PostgreSQL query
- [x] **Contextual Chunk Headers** -- Improved retrieval quality with document-level context injected into each chunk
- [x] **Neural Reranking** -- Cohere rerank-v3.5 selects the most relevant passages from initial retrieval
- [x] **Real-Time Streaming** -- Server-Sent Events (SSE) for token-by-token response streaming
- [x] **Bilingual Support** -- Full English and Nepali (Devanagari) language support
- [x] **ChatGPT-Style UI** -- Professional conversational interface with chat sessions and history
- [x] **Citation-Grounded Responses** -- Every answer includes source document references with citation cards
- [x] **Admin Document Management** -- Drag-and-drop upload for PDF, DOCX, and HTML legal documents
- [x] **User Authentication** -- Signup/login with JWT (access + refresh tokens)
- [x] **Query Classification** -- Automatic detection of legal vs. non-legal queries
- [x] **Configurable RAG Pipeline** -- Tunable chunk size, overlap, retrieval K, reranking threshold, and BM25/vector weights

---

## Screenshots

<!-- Add screenshots here -->

| Chat Interface | Citation Cards | Admin Panel |
|:-:|:-:|:-:|
| *Screenshot coming soon* | *Screenshot coming soon* | *Screenshot coming soon* |

---

## Architecture

```
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
│  - Chat Sessions    │          │  - Streaming (SSE)      │
│  - Markdown Render  │          │  - Hybrid Search        │
└─────────────────────┘          └───────────┬─────────────┘
                                             │
                          ┌──────────────────┼──────────────────┐
                          │                  │                  │
                          ▼                  ▼                  ▼
                 ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
                 │  PostgreSQL  │  │   Google AI   │  │   OpenAI     │
                 │  + pgvector  │  │   Gemini 2.5  │  │  Embeddings  │
                 │              │  │   Flash       │  │  text-emb-   │
                 │ - Users      │  │              │   │  3-large     │
                 │ - Sessions   │  │  (Generation) │  │  (1024 dim)  │
                 │ - Messages   │  └──────────────┘  └──────────────┘
                 │ - Documents  │           │
                 │ - Chunks     │           │
                 │ - Vectors    │  ┌──────────────┐
                 │ - BM25 Index │  │   Cohere     │
                 └──────────────┘  │  rerank-v3.5 │
                                   │              │
                                   │ (Reranking)  │
                                   └──────────────┘
```

### RAG Pipeline Flow

```
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
| **Backend** | FastAPI (Python 3.13), SQLAlchemy 2.0 (async), Alembic |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui v4 |
| **Database** | PostgreSQL 17 + pgvector (unified relational + vector storage) |
| **LLM** | Google Gemini 2.5 Flash |
| **Embeddings** | OpenAI text-embedding-3-large (1024 dimensions) |
| **Reranking** | Cohere rerank-v3.5 |
| **Auth** | Custom JWT (bcrypt + PyJWT) with access/refresh token rotation |
| **Streaming** | Server-Sent Events (SSE) via sse-starlette |
| **Deployment** | Docker Compose on AWS EC2 with Nginx reverse proxy |
| **Doc Parsing** | PyMuPDF (PDF), python-docx (DOCX), BeautifulSoup4 (HTML) |

---

## Project Structure

```
NITI-SATHI/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application entry point
│   │   ├── config.py               # Pydantic settings
│   │   ├── database.py             # Async SQLAlchemy + pgvector init
│   │   ├── dependencies.py         # Dependency injection
│   │   ├── models/                 # SQLAlchemy ORM models
│   │   │   ├── user.py
│   │   │   ├── session.py
│   │   │   ├── message.py
│   │   │   ├── document.py
│   │   │   └── document_chunk.py
│   │   ├── routers/                # API route handlers
│   │   │   ├── auth.py
│   │   │   ├── chat.py
│   │   │   ├── sessions.py
│   │   │   ├── documents.py
│   │   │   └── health.py
│   │   ├── schemas/                # Pydantic request/response schemas
│   │   ├── services/               # Business logic
│   │   │   ├── auth_service.py
│   │   │   ├── session_service.py
│   │   │   ├── document_service.py
│   │   │   ├── ingestion_service.py
│   │   │   ├── vector_store_service.py
│   │   │   ├── rag_service.py
│   │   │   ├── llm_service.py
│   │   │   └── query_classifier.py
│   │   ├── prompts/                # LLM prompt templates
│   │   │   ├── legal_qa.py
│   │   │   └── query_classification.py
│   │   └── utils/                  # Helpers
│   │       ├── security.py
│   │       ├── text_extraction.py
│   │       └── text_processing.py
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/                        # Next.js App Router source
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── nginx/
│   ├── nginx.conf                  # Reverse proxy + SSE config
│   └── Dockerfile
├── data/
│   └── legal_documents/            # Uploaded legal document storage
├── docker-compose.yml              # Production orchestration
├── docker-compose.dev.yml          # Development overrides
├── Makefile                        # Dev convenience commands
├── .env.example                    # Environment variable template
└── .gitignore
```

---

## Prerequisites

- **Python** 3.13+
- **Node.js** 20+
- **PostgreSQL** 17 with [pgvector](https://github.com/pgvector/pgvector) extension (or use Docker)
- **Docker** and **Docker Compose** (recommended for deployment)
- **API Keys:**
  - [Google AI](https://ai.google.dev/) -- Gemini 2.5 Flash (LLM generation)
  - [OpenAI](https://platform.openai.com/) -- text-embedding-3-large (embeddings)
  - [Cohere](https://cohere.com/) -- rerank-v3.5 (reranking)

---

## Quick Start

### Using Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/NITI-SATHI.git
cd NITI-SATHI

# 2. Configure environment
cp .env.example .env
# Edit .env with your API keys and secrets

# 3. Build and start all services
docker compose up --build

# 4. Visit the application
# Frontend: http://localhost
# API Docs: http://localhost/api/docs
```

### Local Development

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend (in a separate terminal)
cd frontend
npm install
npm run dev
```

### Makefile Commands

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

Copy `.env.example` to `.env` and configure the following:

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_API_KEY` | Google AI API key for Gemini | `AIza...` |
| `OPENAI_API_KEY` | OpenAI API key for embeddings | `sk-...` |
| `COHERE_API_KEY` | Cohere API key for reranking | `...` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `your-secure-password` |
| `JWT_SECRET_KEY` | Secret key for JWT signing | `your-super-secret-key` |
| `LLM_MODEL` | LLM model name | `gemini-2.5-flash` |
| `EMBEDDING_MODEL` | Embedding model name | `text-embedding-3-large` |
| `EMBEDDING_DIMENSIONS` | Embedding vector dimensions | `1024` |
| `CHUNK_SIZE` | Text chunk size (characters) | `1000` |
| `CHUNK_OVERLAP` | Overlap between chunks | `200` |
| `BM25_WEIGHT` | Weight for BM25 keyword search | `0.3` |
| `VECTOR_WEIGHT` | Weight for vector similarity search | `0.7` |
| `RETRIEVAL_INITIAL_K` | Initial candidates from hybrid search | `20` |
| `RERANK_TOP_K` | Final passages after reranking | `5` |

---

## API Documentation

Once the backend is running, interactive API documentation is available at:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs) (or `http://localhost/api/docs` via Nginx)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate and receive JWT tokens |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `POST` | `/api/chat` | Send a message and receive a streamed response (SSE) |
| `GET` | `/api/sessions` | List user's chat sessions |
| `GET` | `/api/sessions/{id}/messages` | Get messages for a session |
| `POST` | `/api/documents/upload` | Upload a legal document (admin) |
| `GET` | `/api/documents` | List all ingested documents |
| `GET` | `/api/health` | Health check |

---

## Document Ingestion Pipeline

```
Upload (PDF/DOCX/HTML)
    │
    ▼
┌─────────────────┐
│ Text Extraction  │──── PyMuPDF / python-docx / BeautifulSoup4
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Text Chunking    │──── Recursive splitting with overlap
│ + Context Headers│     (1000 chars, 200 overlap)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Embedding        │──── OpenAI text-embedding-3-large (1024 dim)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Storage          │──── PostgreSQL + pgvector
│                  │     (chunks, vectors, BM25 tsvectors)
└─────────────────┘
```

---

## Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/your-feature`)
3. **Commit** your changes (`git commit -m 'Add your feature'`)
4. **Push** to the branch (`git push origin feature/your-feature`)
5. **Open** a Pull Request

Please ensure:
- Code follows existing project conventions
- New features include appropriate error handling
- API changes are reflected in Pydantic schemas

---

## Team

This project was developed as an academic minor project at **Far Western University**, Nepal.

| Role | Name |
|------|------|
| **Developer** | Mukesh Pant |
| **Team Size** | 4 students |
| **Supervisor** | Er. Rohit Kumar Bisht |
| **Academic Year** | 2024-2025 |

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with dedication at <strong>Far Western University, Nepal</strong>
</p>
