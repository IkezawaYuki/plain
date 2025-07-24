# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a full-stack application with a Go backend and React TypeScript frontend:

- **Backend**: `/backend/` - Go web server using Gin framework
- **Frontend**: `/frontend/` - React TypeScript application built with Vite

## Development Commands

### Quick Start with Make
```bash
make help            # Show all available commands
make setup           # Initial setup (copy .env.example to .env)
make up              # Start all services with Docker
make down            # Stop all services
make logs            # View logs from all services
```

### Docker Management
```bash
make up              # Start all services
make down            # Stop all services
make restart         # Restart all services
make build           # Build all Docker images
make rebuild         # Rebuild without cache
make clean           # Remove containers and volumes
make status          # Show service status
```

### Development Mode (Local)
```bash
make dev-backend     # Run backend locally (cd backend && go run main.go)
make dev-frontend    # Run frontend locally (cd frontend && npm run dev)
make test-backend    # Run Go tests
make test-frontend   # Run React tests
make lint-frontend   # Run ESLint
```

### Database Access
```bash
make db-connect      # Connect to MySQL as application user
make db-root         # Connect to MySQL as root user
```

### Production Deployment
```bash
make deploy-prod     # Deploy to production using deploy.sh script
make prod-up         # Start production services
make prod-down       # Stop production services
make prod-logs       # Show production logs
make prod-status     # Show production service status
make prod-pull       # Pull latest production images
```

### Individual Service Commands
#### Frontend (React + TypeScript + Vite)
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production (runs TypeScript check first)  
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

#### Backend (Go + Gin)
```bash
cd backend
go run main.go       # Start development server on :8080
go build            # Build binary
go mod tidy          # Clean up dependencies
```

## Architecture Overview

### Backend Architecture
- **Framework**: Gin web framework
- **Structure**: Single main.go file with basic REST API setup
- **Port**: Runs on port 8080
- **API Endpoints**: `/api/hello` - returns JSON greeting

### Frontend Architecture  
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite with SWC for fast refresh
- **Styling**: CSS modules (App.css, index.css)
- **Entry Point**: `src/main.tsx` → `src/App.tsx`
- **Development**: Hot module replacement enabled

## Key Dependencies

### Backend
- `github.com/gin-gonic/gin` - Web framework
- Go 1.24.2

### Frontend
- `react` ^19.1.0 - UI library
- `typescript` ~5.8.3 - Type checking
- `vite` ^7.0.4 - Build tool
- `@vitejs/plugin-react-swc` - Fast refresh with SWC
- `eslint` - Code linting

## Development Workflow

1. **Starting both services**:
   - Backend: `cd backend && go run main.go` (port 8080)
   - Frontend: `cd frontend && npm run dev` (typically port 5173)

2. **Making API calls**: Frontend should call backend at `localhost:8080/api/*`

3. **Building for production**: 
   - Frontend: `npm run build` (includes TypeScript compilation)
   - Backend: `go build` in backend directory

## Docker Development

### Environment Setup
1. **Copy environment template**: `cp .env.example .env`
2. **Edit `.env`** with your actual values:
   ```bash
   MYSQL_ROOT_PASSWORD=your_secure_root_password
   MYSQL_DATABASE=plain_db
   MYSQL_USER=your_db_user
   MYSQL_PASSWORD=your_secure_password
   DB_HOST=mysql
   DB_PORT=3306
   DB_USER=your_db_user
   DB_PASSWORD=your_secure_password
   DB_NAME=plain_db
   REACT_APP_API_URL=http://localhost:8080
   ```

### Using Docker Compose
```bash
docker-compose up -d          # Start all services (frontend, backend, mysql)
docker-compose down           # Stop all services
docker-compose logs           # View logs from all services
docker-compose logs backend   # View logs from specific service
```

### Services
- **Frontend**: http://localhost:3000 (React app served via static file server)
- **Backend**: http://localhost:8080 (Go API server)
- **MySQL**: localhost:3306 (Database with credentials from .env file)

### Docker Configuration
- **Backend Dockerfile**: Multi-stage build with Go 1.24, runs as non-root user
- **Frontend Dockerfile**: Node.js build with static file serving on port 3000
- **MySQL**: Official MySQL 8.0 image with persistent volume storage
- **Environment Variables**: All sensitive data stored in `.env` file (not committed to git)

## Production Deployment

### GitHub Actions CI/CD

The project uses GitHub Actions for automated deployment:

1. **On push to main branch**:
   - Run tests (Go and React)
   - Build and push Docker images to GitHub Container Registry
   - Deploy to production server via SSH

2. **Required GitHub Secrets**:
   ```
   HOST                 # Production server IP/hostname
   USERNAME            # SSH username
   PRIVATE_KEY         # SSH private key
   PORT                # SSH port (default: 22)
   DEPLOY_PATH         # Path to project on server (e.g., /opt/plain)
   
   # Database secrets
   MYSQL_ROOT_PASSWORD
   MYSQL_DATABASE
   MYSQL_USER
   MYSQL_PASSWORD
   DB_USER
   DB_PASSWORD
   DB_NAME
   
   # App configuration
   REACT_APP_API_URL   # e.g., https://yourdomain.com
   ```

### Manual Deployment

1. **Server setup**:
   ```bash
   # Clone repository
   git clone <repository-url> /opt/plain
   cd /opt/plain
   
   # Copy and edit production environment
   cp .env.example .env.production
   # Edit .env.production with production values
   ```

2. **Deploy**:
   ```bash
   # Using deployment script
   ./deploy.sh
   
   # Or using Make
   make deploy-prod
   ```

### Production Services
- **Frontend**: http://localhost:80 (port 80)
- **Backend**: http://localhost:8080 (API server)
- **MySQL**: localhost:3306 (Database)

### Health Checks
All production services include health checks:
- **MySQL**: mysqladmin ping
- **Backend**: HTTP GET /api/hello
- **Frontend**: HTTP GET /

## File Organization

- Backend is minimal with just `main.go` containing the server setup
- Frontend follows standard Vite React structure with `src/` containing components
- No custom build scripts or complex configuration - uses framework defaults
- Production configuration in `docker-compose.production.yml`
- Deployment automation in `.github/workflows/deploy.yml`