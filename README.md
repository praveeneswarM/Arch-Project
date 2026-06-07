# ArchGen AI
### Production-Grade AI-Powered Cloud Architecture Studio & HCL Compiler

ArchGen AI is a secure, cloud-native SaaS studio. It allows enterprise DevOps teams to autonomously design visual cloud diagrams, persist configurations in MongoDB databases, secure authentication via JWT tokens, and compile modular, deployable HashiCorp HCL Terraform code automatically.

---

## 🚀 Running the SaaS Stack

### Option 1: Docker Compose (Single-Command Run)
To build and spin up the complete SaaS stack (Next.js multi-stage frontend, FastAPI backend, and MongoDB database cluster), execute:

```bash
docker-compose up --build
```
- **SaaS Web Portal**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Core Server**: [http://localhost:8000](http://localhost:8000)
- **MongoDB Instance**: [http://localhost:27017](http://localhost:27017)

---

### Option 2: Local Manual Setup

#### 1. Setup Database
Ensure you have MongoDB running locally at `mongodb://localhost:27017` or configure custom `MONGO_URI` environment settings.

#### 2. Backend Orchestrator
Navigate to the backend directory, install Python packages, and boot the uvicorn web server:

```bash
cd backend
python -m pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*The server binds to http://localhost:8000.*

#### 3. Frontend Portal
Navigate to the frontend directory, install npm modules, compile Next.js, and launch:

```bash
cd frontend
npm install
npm run dev
```
*The client binds to http://localhost:3000.*

---

## ⚙️ Environment Variables Config

### Backend Configuration (`backend/.env`)
Create a `.env` file under `backend/` using this template:

```env
OPENAI_API_KEY=your_openai_key_here
MODEL_NAME=gpt-4o-mini
AI_PROVIDER=openai
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=deepseek-r1:8b
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=archgen_db
JWT_SECRET_KEY=archgen_super_secure_secret_hash_key_12345!
PORT=8000
HOST=0.0.0.0
```
> [!NOTE]
> The provider chain now resolves as OpenAI → Ollama → Mock. If OpenAI is unavailable, the backend will automatically try Ollama before falling back to mock mode.

### Frontend Configuration (`frontend/.env`)
Create a `.env` file under `frontend/` using this template:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🏛️ Application Routing Architecture

* **`/` (Landing Page)**: Premium monochrome animated introduction showing timelines and CTA studio routes.
* **`/login` (User Authorization)**: Checks credentials and issues JWT Bearer header keys.
* **`/register` (User Registration)**: Hashes passwords with bcrypt and inserts users into MongoDB.
* **`/dashboard` (Protected Studio Workspace)**: Gated route redirecting to login if no token exists. Houses the configuration form, visual diagram editor, and locked tabs panels.

---

## 🛠️ Comprehensive Troubleshooting Manual

### 1. MongoDB Connection Timeouts
* **Symptoms**: Backend startup outputs `Failed to connect to MongoDB: server selection timeout`.
* **Solution**: Ensure your MongoDB instance is running. If running under Docker Compose, the connection URI is dynamically mapped to `mongodb://mongodb:27017`. For local runs, ensure the database port `27017` is bound.

### 2. Authorization (JWT) Expiration & CORS Blockage
* **Symptoms**: Visual canvas throws `401 Unauthorized` errors when listing saved repositories.
* **Solution**: Auth tokens expire in 24 hours. Clear local storage and log back in to renew token scopes.

### 3. Next.js Prerendering Failures
* **Symptoms**: Production build `npm run build` fails at `/page` or `/dashboard`.
* **Solution**: Ensure all Lucide icons are imported correctly. Client-side variables (like `localStorage`) must be read inside `useEffect` blocks to prevent Server-Side Rendering (SSR) discrepancies. Our multi-stage Docker build handles these conditions safely.


---

## 🏗️ ArchGen AI: Azure Production Architecture

This section describes the target production deployment of the ArchGen AI platform itself on Microsoft Azure.

### 1. Architecture Overview
ArchGen AI is a scalable, cloud-native application deployed on Azure. It leverages modern PaaS and serverless offerings to provide a highly available and secure environment for generating cloud architectures and compiling Terraform configurations.

### 2. Azure Production Architecture

**Users**  
&nbsp;&nbsp;↓  
**Azure Front Door + WAF**  
&nbsp;&nbsp;↓  
**Azure Static Web App** *(Next.js Frontend)*  
&nbsp;&nbsp;↓  
**Azure Container Apps** *(FastAPI Backend)*  
&nbsp;&nbsp;↓  
**MongoDB Database** *(Atlas / Stateful Storage)*  

### 3. Component Responsibilities
* **Azure Front Door + WAF**: Global entry point, load balancing, caching, and Web Application Firewall for DDoS and malicious payload protection.
* **Azure Static Web App**: Hosts the static Next.js frontend, ensuring global edge caching and fast delivery of the React Flow UI.
* **Azure Container Apps**: Hosts the FastAPI backend microservices orchestrating business logic (Auth, Architecture Generation, Terraform Generation).
* **MongoDB**: Persistent database storing user profiles, saved projects, and historical architectures.
* **Azure Service Bus**: Asynchronous message queue for heavy document processing and background worker tasks.
* **Azure Key Vault**: Centralized and isolated secret management for AI provider keys, database credentials, and JWT secrets.
* **Azure Redis Cache**: Ephemeral session caching and fast retrieval for repetitive queries.
* **Azure Storage Account**: General-purpose blob storage for exportable files (Terraform zip archives) and static assets.
* **Azure Log Analytics & App Insights**: Telemetry, distributed tracing, and centralized application logging.

### 4. Request Flow
**User** → **Frontend** → **FastAPI Backend** → **ArchitectureReasoningAgent** → **InfrastructureReasoningEngine** → **Architecture Graph** → **Terraform Generator** → **MongoDB Save** → **Frontend Display**

### 5. AI Provider Flow
The AI orchestration pipeline implements a resilient fallback mechanism:
1. **OpenAI** (Primary)
   &nbsp;&nbsp;↓ *If Failure*
2. **Ollama** (Secondary Local/Hosted)
   &nbsp;&nbsp;↓ *If Failure*
3. **Mock Provider** (Deterministic Fallback)

*All provider telemetry and active models are logged and returned directly to the UI.*

### 6. Terraform Generation Flow
The backend synthesizes the visual Architecture Graph into modular HashiCorp Configuration Language (HCL). It utilizes centralized naming enforcement, template mapping for multi-cloud deployments (AWS, Azure, GCP), and ensures output consistency before compressing and returning the templates.

### 7. Deployment Architecture
* **Frontend**: Azure Static Web App
* **Backend**: Azure Container Apps (Autoscaling from 0 to N based on concurrent HTTP requests)
* **Database**: MongoDB Atlas (Multi-region replica set)
* **Cache**: Azure Redis
* **Monitoring**: Azure Monitor

### 8. Security Architecture
* **Azure Front Door WAF**: Protects against OWASP Top 10 vulnerabilities.
* **Azure Key Vault**: Secrets are isolated; components authenticate using Azure Managed Identity.
* **JWT Authentication**: Stateless, expiring token authorization.
* **Role Based Access Control (RBAC)**: Enforced at the control plane.
* **HTTPS Everywhere**: End-to-end TLS encryption.
* **Managed Identity**: Secret Isolation.
* **Audit Logging**: Comprehensive logging via Azure Log Analytics.

### 9. Scalability Strategy
* **Frontend**: Automatically scaled and cached globally via Azure Static Web Apps.
* **Backend**: Azure Container Apps utilizes KEDA (Kubernetes Event-driven Autoscaling) to dynamically scale FastAPI instances based on demand.
* **Database**: MongoDB Atlas allows transparent horizontal sharding and vertical scaling.
* **Cache & Monitoring**: Fully managed PaaS services designed to elastically absorb varying workloads.

### 10. Architecture Diagram

\\mermaid
graph TD

User --> FrontDoor
FrontDoor --> StaticWebApp
StaticWebApp --> FastAPI

FastAPI --> AuthService
FastAPI --> ArchitectureService
FastAPI --> TerraformService

ArchitectureService --> OpenAI
ArchitectureService --> Ollama

FastAPI --> MongoDB
FastAPI --> Redis

FastAPI --> ServiceBus

FastAPI --> KeyVault

FastAPI --> LogAnalytics
\
### 11. Future Multi-Cloud Expansion
While Azure is the primary deployment target, the infrastructure modules are entirely decoupled from the business logic. Future iterations will allow ArchGen AI to be easily deployed on AWS (using CloudFront, S3, ECS Fargate) or GCP (using Cloud Load Balancing, Cloud Storage, Cloud Run) with minimal friction.
