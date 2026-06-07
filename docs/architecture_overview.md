# Architecture Overview

## Frontend Architecture
- Next.js App Router under `frontend/app`
- Shared API wrapper in `frontend/lib/api.ts`
- React Flow canvas and sidebar panels drive the architecture editor
- `useArchitecture` centralizes generation, approvals, undo/redo, and sync

## Backend Architecture
- FastAPI application entrypoint in `backend/main.py`
- API routes split into auth, projects, and architecture orchestration
- Multi-agent AI calls run through the resilient provider wrapper
- Request logging and exception handling are handled at the app layer

## Database Architecture
- MongoDB stores users and projects
- `users` collection handles registration and login persistence
- `projects` collection stores graphs, services, provider choice, and cost metadata

## AI Provider Architecture
- Primary flow is OpenAI when available
- Ollama is the next fallback
- Mock mode is the final fallback
- Provider/model/fallback reason logs are emitted from the provider chain and agent base class

## Terraform Architecture
- Terraform rendering is template-based under `backend/terraform/templates`
- The engine renders `main.tf`, `variables.tf`, `outputs.tf`, and `terraform.tfvars`
- Sensitive values are now expected through secure variables rather than generated defaults

## Deployment Architecture
- `docker-compose.yml` boots MongoDB, backend, and frontend together
- Backend listens on port `8000`
- Frontend listens on port `3000`
- The frontend talks to the backend through `NEXT_PUBLIC_API_URL`
