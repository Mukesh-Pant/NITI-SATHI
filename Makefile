.PHONY: dev-backend dev-frontend dev build deploy

# Development - run backend
dev-backend:
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Development - run frontend
dev-frontend:
	cd frontend && npm run dev

# Run both (use two terminals or background)
dev:
	@echo "Run 'make dev-backend' in one terminal"
	@echo "Run 'make dev-frontend' in another terminal"

# Build Docker images
build:
	docker compose build

# Deploy with Docker Compose
deploy:
	docker compose up -d

# Stop all containers
stop:
	docker compose down

# View logs
logs:
	docker compose logs -f
