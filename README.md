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
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=archgen_db
JWT_SECRET_KEY=archgen_super_secure_secret_hash_key_12345!
PORT=8000
HOST=0.0.0.0
```
> [!NOTE]
> If `OPENAI_API_KEY` is not provided or empty, the backend automatically transitions to a **high-fidelity offline mock generator**. The UI and backend will execute and react dynamically to canvas edits without throwing runtime errors or requiring external tokens.

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
