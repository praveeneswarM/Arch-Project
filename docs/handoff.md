# ArchGen AI - Project Handoff & Status

## Current Progress
We have completed an initial audit of the codebase to identify the root causes of the generic architecture generation and Terraform naming failures. The application currently overrides AI outputs with a deterministic `InfrastructureReasoningEngine` that forces static graph topologies. Terraform template naming conventions violate Azure's strict naming rules. We are currently in **Phase 0 (Audit & Planning)** transitioning into Phase 1 and 2.

## Completed Work
- Implemented `project_execution_plan.md` and `docs/handoff.md` to establish the Phase 0 audit baseline.
- Mapped Authentication flow, Architecture generation flow, Terraform generation flow, and AI provider flow.
- Configured local Ollama AI fallback chains.

# Technical Handoff Document & Audit Findings

## Current State Audit
The system provides a basic functioning React Flow + FastAPI platform but has specific structural flaws that prevent it from being production-ready:
1. **AI Graph Generator**: `InfrastructureReasoningEngine` outputs generic graphs regardless of the user requesting OTT, Banking, or Gaming. Needs conditional rendering of layers based on intent.
2. **AI Provider UI**: The UI says "Waiting" because `page.tsx` does not correctly map `ArchitectureResponse.active_provider` from the backend payload.
3. **Terraform Naming Rules**: Generating Azure Terraform fails `terraform validate` because strings exceed 24 characters or contain underscores. AWS/GCP are completely unmapped.
4. **Auth Flow**: Requires a final full sweep validation.

## Target Architecture Fixes
- `ArchitectureReasoningAgent` focuses purely on intent (workload_classification, compute_preference, etc.).
- `InfrastructureReasoningEngine` uses this intent to inject specific nodes (e.g. Media Processing + WAF for OTT).
- `TerraformEngine` dynamically routes via `FileSystemLoader` and uses a centralized string-sanitizer for resource names to guarantee validation passes.

## Execution Strategy
The remaining work revolves around precision mapping (fixing UI status binding, expanding specific generic nodes like Transcoding, and solidifying the AWS/GCP templates). See `project_execution_plan.md` and `implementation_plan.md` for exact steps.

## Setup Instructions
1. Install dependencies in `backend/` and `frontend/`.
2. Ensure Docker Desktop is running for MongoDB.
3. Ensure Ollama is running locally with the `deepseek-r1:8b` model for offline testing.
4. Set `.env` variable `AI_PROVIDER=ollama` or `openai`.
5. Run backend: `cd backend && uvicorn main:app --reload`
6. Run frontend: `cd frontend && npm run dev`

## Deployment Instructions
- The frontend is a Next.js 14 application built via `npm run build`.
- The backend is a FastAPI application running on Uvicorn.
- Both can be containerized via the included `docker-compose.yml`.

## Next Priority Tasks
1. Execute **Phase 1**: Fix all Terraform naming issues in `main.tf.j2` to pass `terraform plan/validate`.
2. Execute **Phase 2 & 3**: Revamp the Architecture Generation pipeline to utilize the AI directly, expanding prompts for distinct workloads.
