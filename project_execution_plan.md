# Project Execution Plan

## Overview
This document tracks the execution phases for transforming the application into a production-ready SaaS platform, focusing on stabilization, AI provider improvements, and advanced dynamic architecture generation.

## Phase 0 – Mandatory Audit & Execution Plan
- [x] Perform codebase audit
- [x] Map flows
- [x] Document in `project_execution_plan.md`
- [x] Document in `docs/handoff.md`

## Priority 1 — AI Generation Flow
- [ ] Refactor `ArchitectureReasoningAgent` to output distinct workload intents.
- [ ] Refactor `InfrastructureReasoningEngine` to generate visibly different graphs for OTT, Banking, E-Commerce, etc.
- [ ] Prevent direct LLM-to-Terraform generation; maintain deterministic mapping.

## Priority 2 — AI Provider Status
- [ ] Ensure backend returns active provider, model, execution time, and fallback reasons.
- [ ] Fix UI "Waiting" bug to correctly display AI status.
- [ ] Verify OpenAI -> Ollama -> Mock chain fallback logic.

## Priority 3 — Terraform Fixes
- [ ] Build centralized naming engine in `TerraformEngine`.
- [ ] Respect Azure (e.g. 24 char lowercase), AWS, and GCP resource limits.
- [ ] Ensure `terraform validate` and `terraform plan` pass with no duplicate resources or hardcoded secrets.

## Priority 4 — OTT Architecture Improvements
- [ ] Add explicit WAF, Media Processing Layer, Video Transcoding Layer, and Upload Processing Pipeline to OTT mapping.

## Priority 5 — Cloud Provider Support
- [ ] Implement AWS Terraform templates (CloudFront, ECS, RDS, Secrets Manager).
- [ ] Implement GCP Terraform templates (Cloud CDN, Cloud Run, Cloud SQL, Secret Manager).

## Priority 6 — Authentication
- [ ] Verify Register, Login, JWT logic, Protected Routes, and Session Persistence.

## Priority 7 — UI Polish
- [ ] Refine ArchitectureCanvas grouping (VNet/VPC).
- [ ] Adjust typography, loading states, error states, and icons.

## Priority 8 — Final Validation
- [ ] End-to-end tests for all workloads and providers.

---

### Audit Status & Root-Causes Identified
- **AI Generation**: Currently too generic. Needs deterministic structural branches based on classification.
- **AI Provider**: `llm_provider.py` captures stats, but `page.tsx` is likely ignoring or incorrectly binding them.
- **Terraform**: Suffix additions cause duplicates and naming constraint violations. Requires a central string sanitization engine.
- **UI**: Canvas misses container groupings and padding improvements.
