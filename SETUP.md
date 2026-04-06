# NITI-SATHI Setup Guide

**A complete, beginner-friendly guide to setting up and deploying NITI-SATHI -- an AI-powered legal chatbot for Nepali Law and Governance.**

This guide assumes you have never set up a software project before. Every step is explained in plain language. Follow the sections in order.

---

## Table of Contents

- [Part 1: Prerequisites (Software You Need to Install)](#part-1-prerequisites)
- [Part 2: Getting API Keys](#part-2-getting-api-keys)
- [Part 3: Local Development Setup](#part-3-local-development-setup)
- [Part 4: Docker Setup (Recommended for Production-Like Environment)](#part-4-docker-setup)
- [Part 5: Uploading Legal Documents](#part-5-uploading-legal-documents)
- [Part 6: AWS Deployment](#part-6-aws-deployment)
- [Part 7: Environment Variables Reference](#part-7-environment-variables-reference)
- [Part 8: Troubleshooting](#part-8-troubleshooting)

---

## Part 1: Prerequisites

Before you begin, you need to install several programs on your computer. Think of these as the "tools" needed to build and run the project. This section walks you through installing each one.

### 1.1 Install Python 3.13

Python is the programming language used by the backend (the server-side code). You need version 3.13 or newer.

**Windows:**
1. Go to [https://www.python.org/downloads/](https://www.python.org/downloads/)
2. Click the big yellow button that says **"Download Python 3.13.x"** (the exact minor version may differ).
3. Run the downloaded `.exe` file.
4. **IMPORTANT:** On the very first screen of the installer, check the box that says **"Add python.exe to PATH"**. This allows you to use Python from the command line. If you skip this step, many later commands will not work.
5. Click **"Install Now"** and wait for it to finish.
6. To verify, open **Command Prompt** (search "cmd" in the Start menu) and type:
   ```
   python --version
   ```
   You should see something like `Python 3.13.x`.

**macOS:**
1. Go to [https://www.python.org/downloads/macos/](https://www.python.org/downloads/macos/)
2. Download the macOS installer (`.pkg` file) for Python 3.13.
3. Double-click the downloaded file and follow the prompts.
4. To verify, open **Terminal** (search for it using Spotlight) and type:
   ```
   python3 --version
   ```
   You should see something like `Python 3.13.x`.

> **Note for macOS users:** On macOS, Python is typically accessed with `python3` instead of `python`. Wherever this guide says `python`, use `python3` instead. Similarly, use `pip3` instead of `pip`.

**Linux (Ubuntu/Debian):**
1. Open a terminal and run:
   ```bash
   sudo apt update
   sudo apt install software-properties-common
   sudo add-apt-repository ppa:deadsnakes/ppa
   sudo apt update
   sudo apt install python3.13 python3.13-venv python3-pip
   ```
2. Verify:
   ```bash
   python3.13 --version
   ```

---

### 1.2 Install Node.js 20+

Node.js is the runtime environment for the frontend (the user interface). You need version 20 or newer.

**Windows & macOS:**
1. Go to [https://nodejs.org/en/download](https://nodejs.org/en/download)
2. Download the **LTS** version (it should be version 20 or higher). Choose the installer for your operating system (`.msi` for Windows, `.pkg` for macOS).
3. Run the installer and accept all default settings.
4. To verify, open a terminal/command prompt and type:
   ```
   node --version
   ```
   You should see something like `v20.x.x` or higher.
5. Also verify npm (Node Package Manager, which comes with Node.js):
   ```
   npm --version
   ```

**Linux (Ubuntu/Debian):**
1. Open a terminal and run:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   ```
2. Verify:
   ```bash
   node --version
   npm --version
   ```

---

### 1.3 Install Docker Desktop

Docker is a tool that packages your application and all its dependencies (like the database) into "containers" that run the same way on any computer. You need Docker for the production-like setup and deployment.

**Windows:**
1. Go to [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Click **"Download for Windows"**.
3. Run the installer.
4. During installation, make sure **"Use WSL 2 instead of Hyper-V"** is checked (if prompted). WSL 2 (Windows Subsystem for Linux) provides better performance.
5. After installation, restart your computer if prompted.
6. Open Docker Desktop from the Start menu. It may take a minute to start up. You will see a whale icon in the system tray (bottom-right corner) when it is running.
7. To verify, open Command Prompt and type:
   ```
   docker --version
   docker compose version
   ```

> **Windows Requirement:** Docker Desktop on Windows requires WSL 2. If you do not have it, the Docker installer will guide you through enabling it. You may also need to enable "Virtualization" in your computer's BIOS settings. If you see an error about this, search for your computer's model name + "enable virtualization in BIOS" for specific instructions.

**macOS:**
1. Go to [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Click **"Download for Mac"**. Choose the version matching your chip type:
   - **Apple Silicon** (M1, M2, M3, M4 chips): Choose "Apple Silicon"
   - **Intel**: Choose "Intel chip"
   - If you are unsure, click the Apple logo in the top-left corner of your screen, choose "About This Mac", and check the "Chip" or "Processor" line.
3. Open the downloaded `.dmg` file and drag Docker to your Applications folder.
4. Open Docker from Applications. It will ask for your password during first launch.
5. Verify in Terminal:
   ```
   docker --version
   docker compose version
   ```

**Linux (Ubuntu):**
1. Run the following commands in a terminal:
   ```bash
   # Remove old versions if any
   sudo apt remove docker docker-engine docker.io containerd runc

   # Set up Docker repository
   sudo apt update
   sudo apt install ca-certificates curl gnupg
   sudo install -m 0755 -d /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   sudo chmod a+r /etc/apt/keyrings/docker.gpg

   echo \
     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
     $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
     sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

   # Install Docker
   sudo apt update
   sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

   # Allow your user to run Docker without sudo
   sudo usermod -aG docker $USER
   ```
2. **Log out and log back in** for the group change to take effect.
3. Verify:
   ```bash
   docker --version
   docker compose version
   ```

---

### 1.4 Install Git

Git is a version control tool that lets you download ("clone") the project code and track changes over time.

**Windows:**
1. Go to [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. The download should start automatically. Run the installer.
3. Accept all default settings during installation. The defaults work fine.
4. Verify by opening Command Prompt:
   ```
   git --version
   ```

**macOS:**
1. Open Terminal and type:
   ```
   git --version
   ```
2. If Git is not installed, macOS will prompt you to install the Xcode Command Line Tools. Click **"Install"** and follow the prompts.

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install git
git --version
```

---

### 1.5 Install a Code Editor (Recommended)

A code editor makes it easier to view and edit project files. We recommend **Visual Studio Code (VS Code)**.

1. Go to [https://code.visualstudio.com/](https://code.visualstudio.com/)
2. Download and install the version for your operating system.
3. Open VS Code and install these helpful extensions (click the Extensions icon on the left sidebar, then search for each one):
   - **Python** -- adds Python language support
   - **ESLint** -- helps find errors in JavaScript/TypeScript code
   - **Prettier** -- automatically formats your code
   - **Docker** -- adds Docker file support

---

## Part 2: Getting API Keys

NITI-SATHI uses three external AI services. You need a "key" for each one -- think of it as a password that grants your application access to that service.

**Keep your API keys private.** Never share them publicly or commit them to a public code repository. Anyone with your key could use your account and potentially incur charges.

---

### 2.1 Google AI API Key (for Gemini LLM)

The Gemini large language model (LLM) is the "brain" of NITI-SATHI. It reads legal documents and generates answers to user questions.

1. Open your web browser and go to: [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with your Google account (any Gmail account works).
3. You will see a page titled **"API Keys"**. Click the button that says **"Create API Key"**.\-]ay7
4. Google may ask you to select a Google Cloud project. If you do not have one, click **"Create API key in new project"**. Google will automatically create a project for you.
5. After a moment, your API key will appear on screen. It looks like a long string of letters and numbers (e.g., `AIzaSy...`).
6. Click the **copy** icon next to the key to copy it.
7. Paste it somewhere safe -- you will need it in Part 3. A text file on your desktop or a password manager works well.

> **Cost:** Google AI Studio provides a free tier with generous usage limits. For development and testing, you are unlikely to incur any charges.

---

### 2.2 OpenAI API Key (for Embeddings)

OpenAI's embedding model converts text into numbers (called "vectors") so the system can find which legal documents are most relevant to a user's question. This is different from ChatGPT -- we only use OpenAI for this specific conversion step.

1. Open your browser and go to: [https://platform.openai.com](https://platform.openai.com)
2. Click **"Sign up"** if you do not have an account, or **"Log in"** if you do.
3. After signing in, you will see the OpenAI dashboard.
4. **Add billing information** (required to use the API):
   - Click your profile icon in the top-right corner, then click **"Settings"** (or go directly to [https://platform.openai.com/settings/organization/billing/overview](https://platform.openai.com/settings/organization/billing/overview)).
   - Click **"Add payment method"** and enter your credit/debit card details.
   - Set a usage limit (e.g., $5/month) to avoid unexpected charges. The embedding model (`text-embedding-3-large`) costs fractions of a cent per request, so $5 should last a very long time.
5. **Create an API key:**
   - Navigate to **API Keys** (or go directly to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)).
   - Click **"Create new secret key"**.
   - Give it a name like "NITI-SATHI" (optional).
   - Click **"Create secret key"**.
   - Your key will appear once, starting with `sk-...`. **Copy it immediately** -- you will not be able to see it again.
6. Save this key in the same safe place as your Google key.

> **Cost:** The `text-embedding-3-large` model costs approximately $0.00013 per 1,000 tokens (roughly 750 words). Processing a typical legal document costs a fraction of a cent. For development, expect to spend less than $1 total.

---

### 2.3 Cohere API Key (for Reranking)

Cohere's reranking service improves search accuracy by re-ordering search results so the most relevant documents appear first.

1. Open your browser and go to: [https://dashbo-ard.cohere.com](https://dashboard.cohere.com)
2. Click **"Sign up"** and create a free account (you can sign up with Google, GitHub, or email).
3. After signing in, you will land on the Cohere dashboard.
4. Navigate to **"API Keys"** in the left sidebar (or go directly to [https://dashboard.cohere.com/api-keys](https://dashboard.cohere.com/api-keys)).
5. You will see a **Trial API Key** already generated for you. Click the **copy** icon to copy it.
6. Save this key with your other keys.

> **Cost:** Cohere's trial key is completely free and includes 1,000 API calls per month, which is plenty for development and testing. For production use, you can upgrade to a paid plan later.

---

## Part 3: Local Development Setup

This section walks you through running NITI-SATHI directly on your computer (without Docker). This is the best approach when you are actively developing and making changes to the code, because changes take effect immediately.

---

### 3.1 Clone the Repository

"Cloning" downloads a copy of the project code from GitHub to your computer.

1. Open a terminal (Command Prompt or PowerShell on Windows, Terminal on macOS/Linux).
2. Navigate to where you want to store the project. For example:
   ```bash
   cd ~/Desktop
   ```
3. Clone the repository:
   ```bash
   git clone https://github.com/your-username/NITI-SATHI.git
   ```
   > Replace `your-username` with the actual GitHub username or organization where the repository is hosted.
4. Enter the project folder:
   ```bash
   cd NITI-SATHI
   ```

---

### 3.2 Set Up the Environment File

The `.env` file is where you store all your secret keys and settings. The project includes a template file called `.env.example` with placeholder values.

1. Copy the template to create your own `.env` file:

   **Windows (Command Prompt):**
   ```
   copy .env.example .env
   ```

   **macOS/Linux:**
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file in your code editor (e.g., VS Code):
   ```
   code .env
   ```

3. Replace the placeholder values with your actual keys and settings. Here is what every line means and what to put in it:

```bash
# ---------- API Keys ----------

# Google Gemini (LLM)
# Paste the Google AI API key you got in Part 2.1
GOOGLE_API_KEY=AIzaSy...your-actual-key-here

# OpenAI (Embeddings only)
# Paste the OpenAI API key you got in Part 2.2
OPENAI_API_KEY=sk-...your-actual-key-here

# Cohere (Reranking)
# Paste the Cohere API key you got in Part 2.3
COHERE_API_KEY=your-actual-cohere-key-here

# ---------- Database ----------

# PostgreSQL password -- choose any password you like for local development.
# This is the password for the local database on YOUR computer, not for any online service.
POSTGRES_PASSWORD=mysecurepassword123

# Database connection string -- this tells the backend WHERE to find the database.
# Replace "mysecurepassword123" below with whatever password you chose above.
# For local development (without Docker), keep "localhost" as the host.
DATABASE_URL=postgresql+asyncpg://postgres:mysecurepassword123@localhost:5432/nitisathi

# ---------- JWT (Authentication) ----------

# JWT Secret Key -- this is used to sign login tokens. Pick any long random string.
# For production, use something truly random (32+ characters).
# You can generate one by running: python -c "import secrets; print(secrets.token_hex(32))"
JWT_SECRET_KEY=replace-with-a-long-random-string-at-least-32-characters

# JWT Algorithm -- leave this as HS256 (a standard algorithm for signing tokens).
JWT_ALGORITHM=HS256

# How long (in minutes) before a user must refresh their login. 15 minutes is a good default.
ACCESS_TOKEN_EXPIRE_MINUTES=15

# How long (in days) a refresh token is valid. 7 days means users stay logged in for a week.
REFRESH_TOKEN_EXPIRE_DAYS=7

# ---------- AI Models ----------

# Which OpenAI embedding model to use. Do not change this unless you know what you are doing.
EMBEDDING_MODEL=text-embedding-3-large

# The number of dimensions (size) of each embedding vector. Must match the model above.
EMBEDDING_DIMENSIONS=1024

# Which Gemini model to use for generating answers.
LLM_MODEL=gemini-2.5-flash

# ---------- RAG Parameters (Retrieval-Augmented Generation) ----------
# These control how the system searches through legal documents.
# The defaults work well -- only change them if you understand RAG pipelines.

# How many characters each document "chunk" should be when splitting documents.
CHUNK_SIZE=1000

# How many characters of overlap between consecutive chunks (prevents cutting sentences in half).
CHUNK_OVERLAP=200

# How many candidate results to fetch from the database during the initial search.
RETRIEVAL_INITIAL_K=20

# How many of those candidates to keep after reranking (the top most relevant ones).
RERANK_TOP_K=5

# Minimum relevance score (0 to 1). Results below this threshold are discarded.
SCORE_THRESHOLD=0.3

# Weight given to keyword-based search (BM25). Values between 0.0 and 1.0.
BM25_WEIGHT=0.3

# Weight given to meaning-based search (vector similarity). Should add up to 1.0 with BM25_WEIGHT.
VECTOR_WEIGHT=0.7

# ---------- Server Settings ----------

# Which websites are allowed to connect to the backend.
# For local development, this is your frontend's address.
CORS_ORIGINS=["http://localhost:3000"]

# Where uploaded legal documents are stored on disk.
UPLOAD_DIR=./data/legal_documents

# Maximum file size (in megabytes) for uploaded documents.
MAX_UPLOAD_SIZE_MB=50
```

4. **Save the file** after filling in your values.

> **WARNING:** Never commit your `.env` file to Git. It contains secret keys. The project's `.gitignore` file should already exclude it, but double-check.

---

### 3.3 Set Up PostgreSQL with pgvector

NITI-SATHI uses PostgreSQL (a database) with the pgvector extension (which allows storing and searching text embeddings). The easiest way to run PostgreSQL locally is with Docker, even if you run the rest of the application without Docker.

1. Make sure Docker Desktop is running (you should see the whale icon in your system tray).

2. Start just the PostgreSQL container:
   ```bash
   docker compose up postgres -d
   ```
   This command does the following:
   - `docker compose up` starts services defined in `docker-compose.yml`
   - `postgres` specifies that we only want to start the PostgreSQL service
   - `-d` runs it in the background (so you get your terminal back)

3. Wait about 10 seconds, then verify PostgreSQL is running:
   ```bash
   docker compose ps
   ```
   You should see the `postgres` service listed with a status of "Up" or "healthy".

> **What if you want to install PostgreSQL directly (without Docker)?**
> You can install PostgreSQL 17 from [https://www.postgresql.org/download/](https://www.postgresql.org/download/), but you will also need to install the pgvector extension manually. Using Docker for just the database is strongly recommended because it handles all of this automatically with the `pgvector/pgvector:pg17` image.

---

### 3.4 Set Up the Backend

The backend is written in Python using FastAPI. We will set it up in a "virtual environment" -- a self-contained space so that the project's packages do not interfere with other Python projects on your computer.

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create a Python virtual environment:

   **Windows:**
   ```
   python -m venv venv
   ```

   **macOS/Linux:**
   ```bash
   python3 -m venv venv
   ```

   This creates a folder called `venv` inside `backend/`. It contains a private copy of Python for this project.

3. Activate the virtual environment:

   **Windows (Command Prompt):**
   ```
   venv\Scripts\activate
   ```

   **Windows (PowerShell):**
   ```
   venv\Scripts\Activate.ps1
   ```

   > **PowerShell note:** If you get an error about "execution policies", run this command first and try again:
   > ```
   > Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   > ```

   **macOS/Linux:**
   ```bash
   source venv/bin/activate
   ```

   After activating, you should see `(venv)` at the beginning of your terminal prompt. This means the virtual environment is active.

4. Install all required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
   This reads the `requirements.txt` file and downloads all the libraries the backend needs (FastAPI, SQLAlchemy, the AI client libraries, etc.). This may take a few minutes.

5. Set up the database tables using Alembic (the database migration tool):
   ```bash
   alembic upgrade head
   ```
   This command creates all the necessary tables in your PostgreSQL database (users, sessions, messages, documents, document_chunks, etc.).

   > **If you get a "command not found" error for alembic:** Make sure your virtual environment is activated (you should see `(venv)` in your prompt). If the issue persists, try:
   > ```bash
   > python -m alembic upgrade head
   > ```

   > **If you get a database connection error:** Make sure the PostgreSQL container is running (step 3.3) and that your `DATABASE_URL` in the `.env` file matches the password you set for `POSTGRES_PASSWORD`.

6. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

   You should see output like:
   ```
   INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
   INFO:     Started reloader process
   ```

   The `--reload` flag means the server will automatically restart whenever you change the code. This is useful during development.

7. Verify the backend is working by opening your browser and going to:
   - [http://localhost:8000](http://localhost:8000) -- you should see a JSON response with the project name
   - [http://localhost:8000/docs](http://localhost:8000/docs) -- you should see the interactive API documentation (Swagger UI)

**Leave this terminal open and the server running.** Open a new terminal for the next steps.

---

### 3.5 Set Up the Frontend

The frontend is built with Next.js (a React framework) and provides the chat interface that users interact with.

1. Open a **new terminal** (keep the backend terminal running).

2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

3. Create a `.env.local` file to tell the frontend where the backend is:

   **Windows (Command Prompt):**
   ```
   echo NEXT_PUBLIC_API_URL=http://localhost:8000/api > .env.local
   ```

   **macOS/Linux:**
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
   ```

   This tells the frontend to send all API requests to `http://localhost:8000/api`, where your backend is running.

4. Install all required JavaScript packages:
   ```bash
   npm install
   ```
   This reads `package.json` and downloads all the libraries the frontend needs (React, Next.js, UI components, etc.). This may take 2-5 minutes.

5. Start the frontend development server:
   ```bash
   npm run dev
   ```

   You should see output like:
   ```
   ▲ Next.js 16.x.x
   - Local:   http://localhost:3000
   ```

6. Open your browser and go to [http://localhost:3000](http://localhost:3000). You should see the NITI-SATHI chat interface.

---

### 3.6 Verify Everything Works

At this point, you should have three things running:

| Service    | URL                           | Terminal |
|------------|-------------------------------|----------|
| PostgreSQL | `localhost:5432` (no web UI)  | Docker (background) |
| Backend    | `http://localhost:8000`       | Terminal 1 |
| Frontend   | `http://localhost:3000`       | Terminal 2 |

To verify everything is connected:
1. Go to [http://localhost:3000](http://localhost:3000) in your browser.
2. Try creating an account (sign up).
3. Try logging in.
4. Try sending a message in the chat.

If the sign-up and login work, the backend and database are properly connected. If sending a message returns a response (even if it says no relevant documents were found), the AI services are properly configured.

> **Stopping everything:** Press `Ctrl+C` in each terminal to stop the backend and frontend. Run `docker compose down` to stop the PostgreSQL container.

---

## Part 4: Docker Setup

Docker Compose lets you start the entire application (database, backend, frontend, and web server) with a single command. This is the recommended approach for testing production-like behavior and for deployment.

---

### 4.1 Make Sure Docker Desktop Is Running

- **Windows/macOS:** Open Docker Desktop from your Start menu or Applications. Wait until the whale icon in the system tray shows a green/running status.
- **Linux:** Docker runs as a background service. Verify with:
  ```bash
  docker info
  ```

---

### 4.2 Configure the Environment File

If you already created a `.env` file in Part 3, you can reuse it. If not, follow steps 3.1 and 3.2 above to create it.

**One change for Docker:** When using Docker Compose, the database hostname is `postgres` (the name of the Docker service), not `localhost`. However, you do not need to change this yourself -- the `docker-compose.yml` file automatically overrides the `DATABASE_URL` to use the correct hostname:

```
DATABASE_URL=postgresql+asyncpg://postgres:${POSTGRES_PASSWORD}@postgres:5432/nitisathi
```

So your `.env` file can keep `localhost` -- Docker Compose will handle the rest.

---

### 4.3 Build and Start All Services

1. Open a terminal in the project root (the `NITI-SATHI` folder).

2. Build and start everything:
   ```bash
   docker compose up --build
   ```

   Here is what this command does:
   - `docker compose up` starts all four services defined in `docker-compose.yml`: PostgreSQL, backend, frontend, and Nginx
   - `--build` forces Docker to rebuild the images (important when code has changed)

   The first time you run this, it will take 5-15 minutes to download base images and build everything. Subsequent runs will be much faster because Docker caches the layers.

3. Wait until you see log messages indicating all services are healthy. Look for lines like:
   ```
   backend-1   | INFO:     Uvicorn running on http://0.0.0.0:8000
   frontend-1  | ▲ Next.js 16.x.x
   ```

4. Open your browser and go to [http://localhost](http://localhost). You should see the NITI-SATHI interface.

   > **How it works:** Nginx (the web server) runs on port 80 and acts as a "reverse proxy." When you visit `http://localhost`, Nginx decides where to send the request:
   > - Requests to `/api/...` are forwarded to the backend (FastAPI) on port 8000
   > - All other requests are forwarded to the frontend (Next.js) on port 3000
   >
   > This means you access everything through a single URL -- no need to remember different port numbers.

---

### 4.4 Running in the Background

If you want Docker to run in the background (so you can close the terminal):

```bash
docker compose up --build -d
```

The `-d` flag means "detached mode" (runs in the background).

To view logs when running in background mode:
```bash
docker compose logs -f
```

To view logs for a specific service:
```bash
docker compose logs -f backend
```

To stop all services:
```bash
docker compose down
```

To stop all services AND delete the database data (start fresh):
```bash
docker compose down -v
```

> **WARNING:** The `-v` flag deletes all stored data, including your database. Only use this if you want to start completely fresh.

---

### 4.5 Troubleshooting Docker Issues

**Problem: "Port already in use" error**
- Another program is using port 80, 3000, 5432, or 8000.
- Find and stop the conflicting program, or edit `docker-compose.yml` to use a different port. For example, to change port 80 to 8080:
  ```yaml
  nginx:
    ports:
      - "8080:80"  # Changed from "80:80"
  ```
  Then access the app at `http://localhost:8080` instead.

**Problem: "Cannot connect to the Docker daemon"**
- Docker Desktop is not running. Open it from your Start menu/Applications and wait for it to fully start.

**Problem: Build fails with "npm ci" errors**
- This usually means the `package-lock.json` is out of date. Run this to fix:
  ```bash
  cd frontend
  npm install
  cd ..
  docker compose up --build
  ```

**Problem: Backend cannot connect to database**
- Make sure the `POSTGRES_PASSWORD` in your `.env` file does not contain special characters that might be misinterpreted (like `@`, `#`, `$`, or spaces). Use only letters and numbers.
- Wait a few extra seconds -- the backend might start before the database is ready. Docker Compose has a health check for this, but it can sometimes be slow on the first run.

**Problem: "No space left on device"**
- Docker images and containers can take up a lot of disk space. Clean up unused ones:
  ```bash
  docker system prune -a
  ```
  > **WARNING:** This removes ALL unused Docker images, containers, and volumes. If you have other Docker projects, their images will also be removed (but can be rebuilt).

---

## Part 5: Uploading Legal Documents

NITI-SATHI becomes useful once it has legal documents to search through. Here is how to upload documents.

---

### 5.1 Create a User Account

1. Open the application in your browser:
   - Local development: [http://localhost:3000](http://localhost:3000)
   - Docker setup: [http://localhost](http://localhost)

2. Click **"Sign Up"** (or "Register").

3. Fill in your details:
   - **Full Name:** Your name
   - **Email:** Your email address
   - **Password:** Choose a password

4. Click **Sign Up** to create your account.

5. Log in with the email and password you just created.

---

### 5.2 Make Yourself an Admin

By default, new accounts are created with a "user" role, which does not have permission to upload documents. You need to change your role to "admin" using a database command.

**If using Docker:**
1. Open a terminal and run:
   ```bash
   docker compose exec postgres psql -U postgres -d nitisathi
   ```
   This opens a direct connection to the PostgreSQL database inside the Docker container. Let's break down what each part means:
   - `docker compose exec` runs a command inside a running container
   - `postgres` is the name of the container
   - `psql` is the PostgreSQL command-line tool
   - `-U postgres` means log in as the "postgres" user
   - `-d nitisathi` means connect to the "nitisathi" database

2. You should see a `nitisathi=#` prompt. Run this SQL command, replacing `your@email.com` with the email you used to sign up:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
   ```

3. Verify the change:
   ```sql
   SELECT email, role FROM users;
   ```
   You should see your email with the role "admin".

4. Type `\q` and press Enter to exit the database prompt.

**If running PostgreSQL locally (without Docker):**
1. Open a terminal and run:
   ```bash
   psql -U postgres -d nitisathi
   ```
2. Follow steps 2-4 above.

> **After changing your role:** You may need to log out and log back into the application for the change to take effect.

---

### 5.3 Upload Documents

1. After logging in as an admin, look for an **"Admin"** section or **"Documents"** page in the navigation.

2. Click **"Admin" > "Documents"** (or similar, depending on the current UI).

3. Click the **"Upload"** button.

4. Select one or more files to upload. Supported formats:
   - **PDF** files (`.pdf`) -- the most common format for legal documents
   - **Word documents** (`.docx`)

5. Click **Upload** to start the process.

6. **Wait for processing to complete.** After uploading, the system will automatically:
   - Extract text from the documents
   - Split the text into smaller chunks (pieces of about 1,000 characters each)
   - Generate embedding vectors for each chunk (using OpenAI)
   - Store everything in the database

   This can take a few seconds to a few minutes per document, depending on its size. Larger documents (100+ pages) may take longer.

> **Note:** The maximum file size is 50 MB by default (configurable with `MAX_UPLOAD_SIZE_MB` in your `.env` file).

---

### 5.4 Test the System

1. Go back to the **Chat** page.
2. Type a question related to the documents you uploaded. For example:
   - "What does the Constitution of Nepal say about fundamental rights?"
   - "What is the punishment for theft under the Muluki Criminal Code?"
3. The system should respond with an answer based on the uploaded documents, including citations showing which document and section the information came from.

If you get a response like "I could not find relevant information," make sure:
- The documents were fully processed (check the Documents page for status)
- Your question is related to the content of the uploaded documents
- Your API keys are valid and working

---

## Part 6: AWS Deployment

This section walks you through deploying NITI-SATHI to Amazon Web Services (AWS) so it can be accessed by anyone on the internet.

> **Cost Warning:** Running an EC2 instance costs money. A `t3.small` instance costs approximately $15-20 USD per month. Make sure you understand AWS billing before proceeding. You can set up billing alerts at [https://console.aws.amazon.com/billing/](https://console.aws.amazon.com/billing/).

---

### 6.1 Create an AWS Account

1. Go to [https://aws.amazon.com/](https://aws.amazon.com/)
2. Click **"Create an AWS Account"** (top-right corner).
3. Fill in your email, password, and account name.
4. Choose **"Personal"** account type (unless you are deploying for a business).
5. Enter your payment information (credit or debit card). AWS requires this even for free-tier services.
6. Complete the identity verification (phone or SMS).
7. Choose the **"Basic (Free)"** support plan.
8. Wait for your account to be activated (usually takes a few minutes, sometimes up to 24 hours).

---

### 6.2 Launch an EC2 Instance

An EC2 instance is a virtual server in the cloud. Think of it as renting a computer from Amazon.

1. Sign in to the AWS Console at [https://console.aws.amazon.com/](https://console.aws.amazon.com/)

2. In the search bar at the top, type **"EC2"** and click on **"EC2"** in the results.

3. Click the orange **"Launch instance"** button.

4. **Name your instance:**
   - Enter: `NITI-SATHI-Server`

5. **Choose an operating system (AMI):**
   - Under "Application and OS Images", select **"Ubuntu"**.
   - Make sure it says **"Ubuntu Server 22.04 LTS"** and **"64-bit (x86)"**.
   - This is a free-tier-eligible image.

6. **Choose an instance type:**
   - Select **`t3.small`** (2 vCPUs, 2 GB RAM).
   - This is the minimum recommended for running all NITI-SATHI services. A `t3.micro` (free tier) may work for testing but will be slow under any real usage.

   > **For budget-conscious users:** You can start with `t3.micro` (free tier eligible) for initial testing. If the application is slow or runs out of memory, upgrade to `t3.small`.

7. **Create a key pair (for SSH access):**
   - Click **"Create new key pair"**.
   - Name it: `niti-sathi-key`
   - Key pair type: **RSA**
   - Private key file format: **`.pem`** (for macOS/Linux) or **`.ppk`** (for Windows with PuTTY)
   - Click **"Create key pair"**.
   - The key file will automatically download. **Save this file in a safe place** -- you cannot download it again, and you need it to connect to your server.

8. **Configure the security group (firewall rules):**
   - Under "Network settings", click **"Edit"**.
   - Click **"Add security group rule"** multiple times to add the following rules:

   | Type         | Port Range | Source          | Description            |
   |-------------|-----------|-----------------|------------------------|
   | SSH          | 22        | My IP           | Your SSH access        |
   | HTTP         | 80        | Anywhere (0.0.0.0/0) | Web traffic       |
   | HTTPS        | 443       | Anywhere (0.0.0.0/0) | Secure web traffic |

   - **SSH (port 22)** lets you connect to the server from your computer. Setting it to "My IP" restricts access to your current IP address for security.
   - **HTTP (port 80)** allows regular web traffic.
   - **HTTPS (port 443)** allows secure (encrypted) web traffic.

9. **Configure storage:**
   - Change the root volume size to **20 GB** (the default 8 GB is too small for Docker images and legal documents).
   - Keep the volume type as **gp3** (General Purpose SSD).

10. **Launch the instance:**
    - Review your settings and click **"Launch instance"**.
    - Wait for the instance to start (takes about 1-2 minutes).

11. **Get your instance's public IP address:**
    - Go to the **EC2 Dashboard** > **Instances**.
    - Click on your `NITI-SATHI-Server` instance.
    - In the details panel, find **"Public IPv4 address"** (e.g., `54.123.45.67`).
    - Write this down -- you will need it to connect and access the application.

---

### 6.3 Connect to Your Server (SSH)

SSH lets you control your server from your computer's terminal, as if you were typing directly on that remote machine.

**macOS/Linux:**
1. Open Terminal.
2. First, set the correct permissions on your key file:
   ```bash
   chmod 400 ~/Downloads/niti-sathi-key.pem
   ```
   (Adjust the path if you saved the key file elsewhere.)
3. Connect to your server:
   ```bash
   ssh -i ~/Downloads/niti-sathi-key.pem ubuntu@YOUR_PUBLIC_IP
   ```
   Replace `YOUR_PUBLIC_IP` with the IP address from step 6.2.11.
4. If prompted "Are you sure you want to continue connecting?", type `yes` and press Enter.

**Windows:**
1. Open **PowerShell** (search for it in the Start menu).
2. Connect to your server:
   ```
   ssh -i C:\Users\YourName\Downloads\niti-sathi-key.pem ubuntu@YOUR_PUBLIC_IP
   ```
   Replace `YourName` with your Windows username and `YOUR_PUBLIC_IP` with your server's IP.
3. If prompted about the authenticity of the host, type `yes` and press Enter.

> **Windows alternative:** If the `ssh` command does not work, you can use **PuTTY** (a free SSH client). Download it from [https://www.putty.org/](https://www.putty.org/). You will need the `.ppk` key file format.

Once connected, you should see a prompt like:
```
ubuntu@ip-172-31-XX-XX:~$
```

You are now controlling the remote server.

---

### 6.4 Install Docker and Docker Compose on the Server

Run these commands on the remote server (after connecting via SSH):

```bash
# Update the package list
sudo apt update

# Install required packages
sudo apt install -y ca-certificates curl gnupg

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Allow your user to run Docker without sudo
sudo usermod -aG docker $USER

# Apply the group change (or you can log out and back in)
newgrp docker

# Verify Docker is installed
docker --version
docker compose version
```

---

### 6.5 Clone the Repository and Configure

```bash
# Clone the repository
git clone https://github.com/your-username/NITI-SATHI.git
cd NITI-SATHI

# Create the environment file
cp .env.example .env

# Edit the environment file
nano .env
```

> **Using nano:** Nano is a simple text editor that runs in the terminal. Use arrow keys to navigate. After making changes, press `Ctrl+O` to save (then press Enter to confirm the filename), and `Ctrl+X` to exit.

Fill in your `.env` file with the same values as Part 3.2, but make these changes for production:

1. **`JWT_SECRET_KEY`**: Generate a truly random key:
   ```bash
   python3 -c "import secrets; print(secrets.token_hex(32))"
   ```
   Copy the output and paste it as the value.

2. **`POSTGRES_PASSWORD`**: Use a strong password (at least 16 characters, mix of letters, numbers).

3. **`CORS_ORIGINS`**: Change to your domain name:
   ```
   CORS_ORIGINS=["https://yourdomain.com"]
   ```
   If you do not have a domain yet, use your server's IP temporarily:
   ```
   CORS_ORIGINS=["http://YOUR_PUBLIC_IP"]
   ```

4. **`DATABASE_URL`**: Keep the default value. Docker Compose overrides this automatically.

---

### 6.6 Start the Application

```bash
# Build and start all services in the background
docker compose up --build -d
```

This will take 5-15 minutes the first time as it downloads and builds all the images.

Monitor the progress with:
```bash
docker compose logs -f
```

Press `Ctrl+C` to stop watching logs (the services will keep running).

When all services are up, verify by visiting `http://YOUR_PUBLIC_IP` in your browser. You should see the NITI-SATHI interface.

---

### 6.7 Set Up a Domain Name

Using a domain name (like `nitisathi.example.com`) instead of an IP address makes your application easier to find and is required for HTTPS (secure connections).

**Option A: Using AWS Route 53 (AWS's DNS service)**

1. Go to the AWS Console > **Route 53** > **Hosted zones**.
2. Click **"Create hosted zone"**.
3. Enter your domain name (you need to have purchased a domain first -- you can buy one through Route 53 or other providers like Namecheap, GoDaddy, etc.).
4. After creating the hosted zone, click on it and note the **NS (Name Server)** records.
5. Go to your domain registrar (where you bought the domain) and update the nameservers to the ones shown in Route 53.
6. Create an **A record**:
   - Click **"Create record"**.
   - Record type: **A**
   - Value: your EC2 instance's public IP address
   - TTL: 300
   - Click **"Create records"**.

**Option B: Using an External DNS Provider**

If you bought your domain from Namecheap, GoDaddy, Cloudflare, or another provider:
1. Log in to your domain provider's dashboard.
2. Go to **DNS settings** for your domain.
3. Add an **A record**:
   - Host: `@` (or leave blank, depending on the provider)
   - Type: A
   - Value: your EC2 instance's public IP address
   - TTL: 300 (or "Automatic")
4. If you want a `www` subdomain too, add a **CNAME record**:
   - Host: `www`
   - Type: CNAME
   - Value: `yourdomain.com`

> **DNS propagation:** After changing DNS records, it can take anywhere from a few minutes to 48 hours for the changes to take effect worldwide. Usually, it takes 5-30 minutes.

---

### 6.8 Set Up SSL (HTTPS) with Let's Encrypt

SSL/HTTPS encrypts the connection between your users and the server, protecting passwords and data. It also shows the padlock icon in the browser. Let's Encrypt provides free SSL certificates.

1. SSH into your server (if not already connected):
   ```bash
   ssh -i ~/Downloads/niti-sathi-key.pem ubuntu@YOUR_PUBLIC_IP
   ```

2. Install Certbot (the tool that gets SSL certificates from Let's Encrypt):
   ```bash
   sudo apt update
   sudo apt install -y certbot
   ```

3. **Temporarily stop Nginx** (Certbot needs port 80 to verify your domain):
   ```bash
   cd ~/NITI-SATHI
   docker compose stop nginx
   ```

4. Obtain the SSL certificate:
   ```bash
   sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
   ```
   Replace `yourdomain.com` with your actual domain.

   Certbot will ask for:
   - Your email address (for renewal notifications)
   - Agreement to the terms of service (type `Y`)
   - Whether to share your email with EFF (optional, type `Y` or `N`)

   If successful, you will see a message saying the certificate has been saved to `/etc/letsencrypt/live/yourdomain.com/`.

5. Create a directory for SSL certificates that Docker can access:
   ```bash
   sudo mkdir -p ~/NITI-SATHI/ssl
   sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ~/NITI-SATHI/ssl/
   sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ~/NITI-SATHI/ssl/
   sudo chown -R $USER:$USER ~/NITI-SATHI/ssl/
   ```

---

### 6.9 Configure Nginx for HTTPS

1. Edit the Nginx configuration file:
   ```bash
   nano ~/NITI-SATHI/nginx/nginx.conf
   ```

2. Replace the entire contents with the following (replace `yourdomain.com` with your actual domain):

   ```nginx
   upstream backend {
       server backend:8000;
   }

   upstream frontend {
       server frontend:3000;
   }

   # Redirect HTTP to HTTPS
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       return 301 https://$server_name$request_uri;
   }

   # HTTPS server
   server {
       listen 443 ssl;
       server_name yourdomain.com www.yourdomain.com;

       ssl_certificate /etc/nginx/ssl/fullchain.pem;
       ssl_certificate_key /etc/nginx/ssl/privkey.pem;

       # SSL settings
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;
       ssl_prefer_server_ciphers on;

       client_max_body_size 50M;

       # API proxy to FastAPI backend
       location /api/ {
           proxy_pass http://backend/api/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;

           # SSE support
           proxy_buffering off;
           proxy_cache off;
           proxy_set_header Connection '';
           proxy_http_version 1.1;
           chunked_transfer_encoding off;
           proxy_read_timeout 300s;
       }

       # Frontend
       location / {
           proxy_pass http://frontend;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. Update `docker-compose.yml` to expose port 443 and mount the SSL certificates. Edit the nginx section:
   ```bash
   nano ~/NITI-SATHI/docker-compose.yml
   ```

   Change the `nginx` service to:
   ```yaml
   nginx:
     build: ./nginx
     ports:
       - "80:80"
       - "443:443"
     volumes:
       - ./ssl:/etc/nginx/ssl:ro
     depends_on:
       - backend
       - frontend
     restart: unless-stopped
   ```

4. Update `CORS_ORIGINS` in your `.env` file:
   ```bash
   nano ~/NITI-SATHI/.env
   ```
   Change:
   ```
   CORS_ORIGINS=["https://yourdomain.com"]
   ```

5. Rebuild and restart everything:
   ```bash
   cd ~/NITI-SATHI
   docker compose up --build -d
   ```

---

### 6.10 Verify the Deployment

1. Open your browser and go to `https://yourdomain.com`. You should see:
   - The NITI-SATHI chat interface
   - A padlock icon in the browser's address bar (indicating HTTPS is working)

2. Try `http://yourdomain.com` -- it should automatically redirect to `https://`.

3. Test the full flow:
   - Sign up for an account
   - Make yourself an admin (see Part 5.2, using `docker compose exec` on the server)
   - Upload a test document
   - Ask a question about the document

---

### 6.11 Set Up Automatic SSL Certificate Renewal

Let's Encrypt certificates expire every 90 days. Set up automatic renewal so you never have to think about it.

1. Create a renewal script:
   ```bash
   nano ~/renew-ssl.sh
   ```

   Paste the following:
   ```bash
   #!/bin/bash
   # Renew SSL certificates and restart Nginx

   cd ~/NITI-SATHI

   # Stop Nginx to free port 80
   docker compose stop nginx

   # Renew certificates
   sudo certbot renew --standalone

   # Copy renewed certificates
   sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ~/NITI-SATHI/ssl/
   sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ~/NITI-SATHI/ssl/

   # Restart Nginx
   docker compose start nginx
   ```

   Replace `yourdomain.com` with your actual domain.

2. Make the script executable:
   ```bash
   chmod +x ~/renew-ssl.sh
   ```

3. Set up a cron job (scheduled task) to run this script monthly:
   ```bash
   crontab -e
   ```

   If asked to choose an editor, choose `nano` (option 1).

   Add this line at the bottom of the file:
   ```
   0 3 1 * * /home/ubuntu/renew-ssl.sh >> /home/ubuntu/ssl-renewal.log 2>&1
   ```

   This runs the renewal script at 3:00 AM on the 1st of every month.

   Save and exit (`Ctrl+O`, Enter, `Ctrl+X`).

---

## Part 7: Environment Variables Reference

This table explains every variable in the `.env.example` file. All variables marked as "Required" must be filled in for the application to work.

| Variable | Description | Example Value | Required? |
|----------|-------------|---------------|-----------|
| `GOOGLE_API_KEY` | Your Google AI API key, used to access the Gemini large language model for generating answers to user questions. | `AIzaSyB...abc123` | Yes |
| `OPENAI_API_KEY` | Your OpenAI API key, used exclusively for generating text embeddings (converting text into numerical vectors for similarity search). | `sk-proj-abc...xyz` | Yes |
| `COHERE_API_KEY` | Your Cohere API key, used for reranking search results to improve the relevance of retrieved document chunks. | `abc123def456` | Yes |
| `POSTGRES_PASSWORD` | The password for the PostgreSQL database. Choose any password for local development. Use a strong, unique password for production. | `mysecurepassword123` | Yes |
| `DATABASE_URL` | The full connection string for PostgreSQL. Format: `postgresql+asyncpg://USER:PASSWORD@HOST:PORT/DATABASE`. The password must match `POSTGRES_PASSWORD`. When using Docker Compose, the host should be `postgres` (the Docker service name). For local development, use `localhost`. | `postgresql+asyncpg://postgres:mysecurepassword123@localhost:5432/nitisathi` | Yes |
| `JWT_SECRET_KEY` | A secret string used to sign JSON Web Tokens (JWTs) for user authentication. This should be a long, random string. If someone learns this key, they could forge login tokens. Generate one with: `python -c "import secrets; print(secrets.token_hex(32))"` | `a1b2c3d4e5f6...` (64 hex characters) | Yes |
| `JWT_ALGORITHM` | The algorithm used to sign JWTs. `HS256` (HMAC-SHA256) is the standard choice. Do not change this unless you have a specific reason. | `HS256` | Yes (default: `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | How many minutes an access token is valid before the user must refresh it. Shorter times are more secure but may annoy users. 15 minutes is a good balance. | `15` | No (default: `15`) |
| `REFRESH_TOKEN_EXPIRE_DAYS` | How many days a refresh token lasts. This controls how long users stay "logged in" without re-entering their password. | `7` | No (default: `7`) |
| `EMBEDDING_MODEL` | The name of the OpenAI embedding model to use. `text-embedding-3-large` produces high-quality embeddings for accurate document search. | `text-embedding-3-large` | No (default: `text-embedding-3-large`) |
| `EMBEDDING_DIMENSIONS` | The number of dimensions in each embedding vector. Must match the model's output. For `text-embedding-3-large`, use `1024`. Higher dimensions mean more accurate search but use more storage. | `1024` | No (default: `1024`) |
| `LLM_MODEL` | The name of the Google Gemini model to use for generating answers. `gemini-2.5-flash` is fast and cost-effective. | `gemini-2.5-flash` | No (default: `gemini-2.5-flash`) |
| `CHUNK_SIZE` | When a document is uploaded, it is split into smaller pieces called "chunks." This value controls the maximum number of characters in each chunk. Larger chunks retain more context but may reduce search precision. | `1000` | No (default: `1000`) |
| `CHUNK_OVERLAP` | The number of characters that overlap between consecutive chunks. This overlap prevents important sentences from being cut in half at chunk boundaries. | `200` | No (default: `200`) |
| `RETRIEVAL_INITIAL_K` | During a search, this many candidate chunks are initially retrieved from the database using a combination of keyword and vector search. More candidates mean better recall but slower processing. | `20` | No (default: `20`) |
| `RERANK_TOP_K` | After reranking the initial candidates, only this many top results are kept and used to generate the answer. Fewer results mean more focused answers. | `5` | No (default: `5`) |
| `SCORE_THRESHOLD` | The minimum relevance score (between 0.0 and 1.0) a chunk must have to be included in the answer. Chunks scoring below this threshold are discarded. Lower values include more results; higher values are stricter. | `0.3` | No (default: `0.3`) |
| `BM25_WEIGHT` | The weight given to BM25 (keyword-based) search in the hybrid search. BM25 finds exact word matches. Combined with `VECTOR_WEIGHT`, these two values should add up to 1.0. | `0.3` | No (default: `0.3`) |
| `VECTOR_WEIGHT` | The weight given to vector (meaning-based) search in the hybrid search. Vector search finds semantically similar content even when different words are used. Combined with `BM25_WEIGHT`, should add up to 1.0. | `0.7` | No (default: `0.7`) |
| `CORS_ORIGINS` | A JSON array of URLs that are allowed to access the backend API. For local development, this is the frontend's URL. For production, use your domain. Must be valid JSON format with double quotes. | `["http://localhost:3000"]` | Yes |
| `UPLOAD_DIR` | The file path where uploaded legal documents are stored on disk. Relative paths are relative to the backend directory. | `./data/legal_documents` | No (default: `./data/legal_documents`) |
| `MAX_UPLOAD_SIZE_MB` | The maximum file size (in megabytes) allowed for document uploads. Files larger than this will be rejected. | `50` | No (default: `50`) |

---

## Part 8: Troubleshooting

This section covers the most common problems you might encounter and how to fix them.

---

### "Module not found" or "No module named ..." errors (Backend)

**Symptom:** When starting the backend, you see an error like `ModuleNotFoundError: No module named 'fastapi'`.

**Cause:** The Python virtual environment is either not activated or the dependencies were not installed.

**Fix:**
1. Make sure you are in the `backend` directory.
2. Activate the virtual environment:
   - **Windows:** `venv\Scripts\activate`
   - **macOS/Linux:** `source venv/bin/activate`
3. You should see `(venv)` at the beginning of your terminal prompt.
4. Reinstall dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

### "Module not found" errors (Frontend)

**Symptom:** When starting the frontend, you see errors about missing packages.

**Cause:** The `node_modules` directory is missing or incomplete.

**Fix:**
1. Make sure you are in the `frontend` directory.
2. Delete the existing `node_modules` and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```
   On Windows Command Prompt, use:
   ```
   rmdir /s /q node_modules
   npm install
   ```

---

### Docker build failures

**Symptom:** `docker compose up --build` fails with errors.

**Common causes and fixes:**

1. **"ERROR: failed to solve: failed to read dockerfile"**
   - You are running `docker compose` from the wrong directory. Make sure you are in the project root (`NITI-SATHI/`) where `docker-compose.yml` is located.

2. **Network/download errors during build**
   - Check your internet connection.
   - Try again -- sometimes package servers are temporarily unavailable.
   - If behind a corporate firewall/VPN, try disconnecting the VPN.

3. **"npm ERR! Could not resolve dependency"**
   - Run `cd frontend && npm install && cd ..` to update `package-lock.json`, then try `docker compose up --build` again.

---

### Database connection issues

**Symptom:** The backend starts but crashes with a database connection error like `connection refused` or `could not connect to server`.

**Fixes:**

1. **Is PostgreSQL running?**
   - Docker: Run `docker compose ps` and check that the `postgres` service is "Up" and "healthy."
   - If not, start it: `docker compose up postgres -d`

2. **Is the password correct?**
   - Open your `.env` file and make sure the password in `DATABASE_URL` exactly matches `POSTGRES_PASSWORD`.
   - Example: If `POSTGRES_PASSWORD=abc123`, then `DATABASE_URL` must contain `...postgres:abc123@...`

3. **Is the hostname correct?**
   - For local development (without Docker): Use `localhost`
   - For Docker Compose: Use `postgres` (Docker Compose overrides this automatically, but check if you modified it manually)

4. **Is the database created?**
   - Connect to PostgreSQL and check:
     ```bash
     docker compose exec postgres psql -U postgres -l
     ```
   - You should see `nitisathi` in the list. If not, create it:
     ```bash
     docker compose exec postgres psql -U postgres -c "CREATE DATABASE nitisathi;"
     ```

---

### API key errors

**Symptom:** The application starts but chat responses fail, or you see errors mentioning API keys or authentication.

**Fixes:**

1. **"Invalid API Key" or "Unauthorized"**
   - Double-check that the key in your `.env` file is correct. Make sure there are no extra spaces or newline characters.
   - Re-copy the key from the provider's dashboard.

2. **"Quota exceeded" or "Rate limit"**
   - You have used up your free quota or hit a rate limit.
   - For OpenAI: Check your usage at [https://platform.openai.com/usage](https://platform.openai.com/usage) and add billing credits if needed.
   - For Cohere: The trial key has a limit of 1,000 calls/month. Consider upgrading if needed.
   - For Google AI: Check your quota at [https://aistudio.google.com/](https://aistudio.google.com/).

3. **Environment variables not loaded**
   - If using Docker: Make sure the `.env` file is in the project root (same directory as `docker-compose.yml`).
   - If running locally: Make sure the `.env` file is in the project root AND you started the backend from the correct directory.

---

### Port conflicts

**Symptom:** Error messages like `Bind for 0.0.0.0:8000 failed: port is already allocated` or `address already in use`.

**Cause:** Another program is already using that port.

**Fix:**
1. Find what is using the port:

   **Windows:**
   ```
   netstat -ano | findstr :8000
   ```
   The last number in the output is the PID (Process ID). Kill it:
   ```
   taskkill /PID <PID_NUMBER> /F
   ```

   **macOS/Linux:**
   ```bash
   lsof -i :8000
   ```
   Kill the process:
   ```bash
   kill -9 <PID_NUMBER>
   ```

2. Alternatively, change the port in `docker-compose.yml`. For example, to move the backend from port 8000 to 8001:
   ```yaml
   backend:
     ports:
       - "8001:8000"
   ```

---

### Nginx configuration issues

**Symptom:** You can access the backend and frontend directly (on ports 8000 and 3000) but not through Nginx (port 80).

**Fixes:**

1. **Check if Nginx is running:**
   ```bash
   docker compose ps
   ```
   If the Nginx container keeps restarting, check its logs:
   ```bash
   docker compose logs nginx
   ```

2. **Configuration syntax error:**
   - If you edited `nginx.conf`, the error is likely a typo. Look for missing semicolons (`;`) or mismatched braces (`{}`).
   - Test the configuration:
     ```bash
     docker compose exec nginx nginx -t
     ```

3. **"502 Bad Gateway":**
   - The backend or frontend containers are not running or have not finished starting.
   - Wait 30 seconds and refresh. Check `docker compose ps` to ensure all services are "Up."

---

### Application is slow or unresponsive

**Possible causes:**

1. **Not enough memory (RAM):**
   - On an EC2 `t3.micro` instance (1 GB RAM), all services might compete for memory.
   - Solution: Upgrade to `t3.small` (2 GB) or `t3.medium` (4 GB).

2. **Large documents taking too long to process:**
   - Processing a 500-page PDF can take several minutes.
   - Monitor progress in the backend logs: `docker compose logs -f backend`

3. **Docker using too much disk space:**
   - Check available disk space: `df -h`
   - Clean up Docker: `docker system prune -a`

---

### Permission denied errors (Linux/macOS)

**Symptom:** `Permission denied` when running Docker commands.

**Fix:**
- Make sure you added your user to the Docker group:
  ```bash
  sudo usermod -aG docker $USER
  ```
- Log out and log back in for the change to take effect.
- On Linux, you can also run: `newgrp docker`

---

### SSL certificate issues

**Symptom:** Browser shows "Your connection is not private" or certificate errors.

**Fixes:**

1. **Certificate files not found:**
   - Make sure the SSL certificate files exist in the `ssl/` directory:
     ```bash
     ls -la ~/NITI-SATHI/ssl/
     ```
   - You should see `fullchain.pem` and `privkey.pem`.

2. **Certificate expired:**
   - Run the renewal script:
     ```bash
     ~/renew-ssl.sh
     ```

3. **Domain does not match certificate:**
   - The domain in your browser URL must exactly match the domain you used when obtaining the certificate.

---

## Quick Reference: Common Commands

Here is a summary of the most frequently used commands:

```bash
# --- Local Development ---

# Start PostgreSQL (from project root)
docker compose up postgres -d

# Start backend (from backend/ directory, with venv activated)
uvicorn app.main:app --reload

# Start frontend (from frontend/ directory)
npm run dev

# --- Docker (Full Stack) ---

# Build and start everything
docker compose up --build

# Start in background
docker compose up --build -d

# Stop everything
docker compose down

# View logs
docker compose logs -f

# View logs for one service
docker compose logs -f backend

# Restart a single service
docker compose restart backend

# --- Database ---

# Open database shell (Docker)
docker compose exec postgres psql -U postgres -d nitisathi

# Make a user admin
# (run inside psql shell)
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';

# --- Maintenance ---

# Check running containers
docker compose ps

# Clean up Docker disk space
docker system prune -a

# Check server disk space
df -h
```

---

## Need Help?

If you run into issues not covered here:

1. **Check the logs.** Most errors are clearly explained in the terminal output or Docker logs.
2. **Search the error message online.** Copy the exact error message and search for it -- chances are someone else has encountered and solved the same problem.
3. **Make sure all services are running.** Run `docker compose ps` to verify.
4. **Restart everything.** Sometimes a clean restart fixes transient issues:
   ```bash
   docker compose down
   docker compose up --build -d
   ```

---

*NITI-SATHI -- AI-Powered Legal Chatbot for Nepali Law and Governance*
