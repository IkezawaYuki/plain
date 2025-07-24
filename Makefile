.PHONY: help setup up down restart logs clean build test lint deploy-prod

# Default target
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

setup: ## Initial setup - copy .env.example to .env
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "Created .env file from .env.example"; \
		echo "Please edit .env with your actual values before running 'make up'"; \
	else \
		echo ".env file already exists"; \
	fi

up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

restart: ## Restart all services
	docker-compose restart

logs: ## Show logs from all services
	docker-compose logs -f

logs-backend: ## Show logs from backend service
	docker-compose logs -f backend

logs-frontend: ## Show logs from frontend service
	docker-compose logs -f frontend

logs-mysql: ## Show logs from mysql service
	docker-compose logs -f mysql

build: ## Build all Docker images
	docker-compose build

rebuild: ## Rebuild all Docker images without cache
	docker-compose build --no-cache

clean: ## Remove all containers, networks, and volumes
	docker-compose down -v
	docker system prune -f

clean-all: ## Remove everything including images
	docker-compose down -v --rmi all
	docker system prune -af

# Development commands
dev-backend: ## Run backend in development mode
	cd backend && go run main.go

dev-frontend: ## Run frontend in development mode
	cd frontend && npm run dev

test-backend: ## Run backend tests
	cd backend && go test ./...

test-frontend: ## Run frontend tests
	cd frontend && npm test

lint-frontend: ## Run frontend linting
	cd frontend && npm run lint

build-backend: ## Build backend binary
	cd backend && go build -o plain main.go

build-frontend: ## Build frontend for production
	cd frontend && npm run build

# Database commands
db-connect: ## Connect to MySQL database
	docker-compose exec mysql mysql -u $$(grep MYSQL_USER .env | cut -d '=' -f2) -p$$(grep MYSQL_PASSWORD .env | cut -d '=' -f2) $$(grep MYSQL_DATABASE .env | cut -d '=' -f2)

db-root: ## Connect to MySQL as root
	docker-compose exec mysql mysql -u root -p$$(grep MYSQL_ROOT_PASSWORD .env | cut -d '=' -f2)

# Status commands
status: ## Show status of all services
	docker-compose ps

ps: ## Alias for status
	docker-compose ps

# Production commands
deploy-prod: ## Deploy to production using deploy.sh script
	./deploy.sh

prod-up: ## Start production services
	docker-compose -f docker-compose.production.yml --env-file .env.production up -d

prod-down: ## Stop production services
	docker-compose -f docker-compose.production.yml --env-file .env.production down

prod-logs: ## Show production logs
	docker-compose -f docker-compose.production.yml --env-file .env.production logs -f

prod-status: ## Show production service status
	docker-compose -f docker-compose.production.yml --env-file .env.production ps

prod-pull: ## Pull latest production images
	docker-compose -f docker-compose.production.yml --env-file .env.production pull