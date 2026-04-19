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

---

## Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                        Nginx (Port 80)                          │
│                   Reverse Proxy + SSE support                   │
│              (production / server deployment only)              │
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
│   │   ├── dependencies.py         # Dependency injection (auth guards)
│   │   ├── models/                 # SQLAlchemy ORM models
│   │   ├── routers/                # API route handlers
│   │   ├── schemas/                # Pydantic request/response schemas
│   │   ├── services/               # Business logic (RAG, LLM, ingestion)
│   │   ├── prompts/                # LLM prompt templates
│   │   └── utils/                  # Helpers (security, text extraction)
│   ├── make_admin.py               # CLI tool to create/promote admin users
│   ├── init_db.py                  # Database initialisation script
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/             # Login + signup pages
│   │   │   ├── (app)/              # Authenticated shell
│   │   │   │   ├── chat/           # Chat interface
│   │   │   │   ├── settings/       # User settings
│   │   │   │   └── admin/
│   │   │   │       └── documents/  # Admin document management UI
│   │   │   └── api/chat/           # Next.js SSE proxy route
│   │   ├── components/             # UI components
│   │   ├── contexts/               # Auth + sidebar contexts
│   │   ├── hooks/                  # useChat SSE hook
│   │   ├── lib/                    # Typed API client + constants
│   │   └── types/                  # Shared TypeScript interfaces
│   ├── next.config.ts              # Next.js config (rewrites for no-nginx mode)
│   ├── Dockerfile
│   └── package.json
├── nginx/
│   ├── nginx.conf                  # Reverse proxy + SSE config
│   └── Dockerfile
├── data/
│   └── legal_documents/            # Uploaded legal document storage
├── docker-compose.yml              # Production stack (with Nginx)
├── docker-compose.dev.yml          # Local stack (no Nginx)
└── .env.example                    # Environment variable template
```

---

## Prerequisites

- **Docker** and **Docker Compose** — required for the recommended setup
- **API Keys** — you need accounts and keys for three services:
  - [Google AI Studio](https://aistudio.google.com/) — Gemini LLM
  - [OpenAI Platform](https://platform.openai.com/) — text embeddings
  - [Cohere](https://cohere.com/) — neural reranking

---

## Getting Started (Full Guide)

### Step 1 — Clone the repository

```bash
git clone https://github.com/Mukesh-Pant/NITI-SATHI.git
cd NITI-SATHI
```

### Step 2 — Create your `.env` file

```bash
cp .env.example .env
```

Open `.env` and fill in every value:

```env
GOOGLE_API_KEY=your_google_ai_api_key
OPENAI_API_KEY=your_openai_api_key
COHERE_API_KEY=your_cohere_api_key
POSTGRES_PASSWORD=choose_a_strong_password
JWT_SECRET_KEY=choose_a_long_random_secret
```

> All other variables in `.env.example` have working defaults and do not need to be changed for a first run.

### Step 3 — Choose your run mode

#### Option A: Local / personal machine (no Nginx, recommended for testing)

Runs three containers — database, backend, frontend. The frontend proxies API calls internally so no reverse proxy is needed.

```bash
docker compose -f docker-compose.dev.yml up --build
```

Access the app at **http://localhost:3000**

#### Option B: Server / VM deployment (with Nginx on port 80)

Runs all four containers including Nginx as the single entry point.

```bash
docker compose up --build
```

Access the app at **http://your-server-ip** (port 80)

> **Which one should I use?**
> Use Option A on your laptop or any machine where you just want to test the app.
> Use Option B when deploying to a VM, EC2 instance, or any machine intended to serve real users.

---

### Step 4 — Create your first admin user

The app requires at least one admin user to upload legal documents. There are two ways to do this.

#### Option A — Promote an account you already signed up with

First sign up normally at `/signup`, then run:

```bash
# Replace the email with whichever account you signed up with
docker exec -it niti-sathi-backend-1 python make_admin.py promote your@email.com
```

#### Option B — Create a brand-new admin account from the command line

```bash
docker exec -it niti-sathi-backend-1 python make_admin.py create admin@example.com "Your Name" yourpassword
```

After either option, **log out and log back in** so your session picks up the admin role.

#### Verify it worked

```bash
docker exec -it niti-sathi-backend-1 python make_admin.py list
```

> **Note for `docker-compose.dev.yml` users:** the container name is the same — `niti-sathi-backend-1`.

---

### Step 5 — Upload legal documents

Once logged in as an admin, navigate to:

```
http://localhost:3000/admin/documents        # local mode
http://your-server-ip/admin/documents       # server mode
```

You can drag-and-drop or click to upload files. Supported formats:

| Format | Extension |
|--------|-----------|
| PDF | `.pdf` |
| Word document | `.docx`, `.doc` |
| Web page | `.html`, `.htm` |

Each upload is processed in the background:
1. Text is extracted from the file
2. Text is split into overlapping chunks
3. Each chunk is embedded via OpenAI (`text-embedding-3-large`)
4. Chunks + vectors are stored in PostgreSQL
5. Status changes from **Indexing** → **Ready**

Wait until all documents show **Ready** before querying. Large documents (100+ pages) may take a few minutes.

---

### Step 6 — Start chatting

Navigate to `/chat` and ask any question about Nepali law. Every response is grounded in the documents you uploaded and includes numbered citation cards.

---

## Admin Seeding Script Reference

`backend/make_admin.py` is a standalone CLI tool for managing admin users. Run it inside the backend container with `docker exec`.

```bash
# Promote an existing registered user to admin
docker exec -it niti-sathi-backend-1 python make_admin.py promote <email>

# Create a new admin user (skips signup — useful for fresh deployments)
docker exec -it niti-sathi-backend-1 python make_admin.py create <email> "<Full Name>" <password>

# List all current admin accounts
docker exec -it niti-sathi-backend-1 python make_admin.py list
```

The script is idempotent — running `promote` on an already-admin account prints a notice and makes no changes.

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_API_KEY` | Google AI API key (Gemini 2.5 Flash) | — required |
| `OPENAI_API_KEY` | OpenAI API key (embeddings) | — required |
| `COHERE_API_KEY` | Cohere API key (reranking) | — required |
| `POSTGRES_PASSWORD` | PostgreSQL password | `postgres` |
| `JWT_SECRET_KEY` | Secret for JWT signing | — required |
| `LLM_MODEL` | LLM model name | `gemini-2.5-flash` |
| `EMBEDDING_MODEL` | Embedding model | `text-embedding-3-large` |
| `EMBEDDING_DIMENSIONS` | Vector dimensions | `1024` |
| `CHUNK_SIZE` | Text chunk size in characters | `1000` |
| `CHUNK_OVERLAP` | Overlap between chunks | `200` |
| `BM25_WEIGHT` | BM25 search weight | `0.3` |
| `VECTOR_WEIGHT` | Vector search weight | `0.7` |
| `RETRIEVAL_INITIAL_K` | Initial hybrid search candidates | `20` |
| `RERANK_TOP_K` | Final passages after reranking | `5` |

---

## API Documentation

With the backend running, interactive API docs are available at:

- **Swagger UI:** `http://localhost:8000/docs` (direct) or `http://localhost/api/docs` (via Nginx)
- **ReDoc:** `http://localhost:8000/redoc`

### Key Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/signup` | — | Register a new user |
| `POST` | `/api/auth/login` | — | Authenticate, receive JWT tokens |
| `POST` | `/api/auth/refresh` | — | Refresh access token |
| `GET` | `/api/auth/me` | User | Get current user profile |
| `GET` | `/api/sessions` | User | List chat sessions |
| `POST` | `/api/chat` | User | Send a message (SSE stream) |
| `POST` | `/api/documents/upload` | Admin | Upload a legal document |
| `GET` | `/api/documents` | Admin | List all ingested documents |
| `DELETE` | `/api/documents/{id}` | Admin | Delete a document and its vectors |
| `GET` | `/api/health` | — | Health check |

---

## How Nginx Fits In

The project has two run modes so that Nginx is not a requirement for local use:

| Mode | Entry point | Who proxies `/api/*`? |
|------|-------------|----------------------|
| Local (`docker-compose.dev.yml`) | `localhost:3000` | Next.js rewrites (built in) |
| Production (`docker-compose.yml`) | `your-ip:80` | Nginx intercepts before Next.js |

In both modes the frontend is built with `NEXT_PUBLIC_API_URL=/api` (a relative path), so no URLs change between environments. The routing layer is the only difference.

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
