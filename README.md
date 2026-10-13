# AI SENTINEL — Automated AI Model Risk Assessment & Governance Platform

> **Tagline:** Secure AI. Measure Risk. Build Trust.

AI Sentinel is a cybersecurity-grade platform designed for automated AI model risk assessment, bias detection, adversarial vulnerability evaluation, privacy risk analysis, and NIST AI RMF governance compliance mapping.

---

## 1. Architecture & Tech Stack

- **Frontend:**
  - **Framework:** React 18 with React Router v6
  - **Bundler:** Modern Webpack 5 (**Strictly non-Vite architecture**)
  - **Styling:** Vanilla CSS & Tailwind CSS with Cyber-Green design system
  - **Visualizations:** Recharts (Radar charts, Bar charts, responsive meters)
  - **Icons:** Lucide React
- **Backend:**
  - **Language:** Python 3.13
  - **Framework:** FastAPI with async lifespan management
  - **Validation:** Pydantic v2 schemas
  - **Database Driver:** Motor & PyMongo async drivers
  - **Documentation:** Interactive OpenAPI / Swagger UI (`/docs`) & ReDoc (`/redoc`)
- **Database:**
  - **Engine:** Local MongoDB Community Server (`mongodb://127.0.0.1:27017`)
  - **Database Name:** `ai_sentinel`
  - **Inspection GUI:** MongoDB Compass
  - **Cloud Ready:** Zero code changes required for MongoDB Atlas migration
- **AI/ML & Security Engine:**
  - Scikit-learn & Fairlearn algorithms
  - Adversarial gradient perturbation testing (FGSM / ART probes)
  - Differential demographic parity & equalized odds metrics
  - Privacy PII regex & training data extraction resistance checks
  - OWASP Top 10 for LLMs automated red-teaming probe suite
  - Deterministic 0–100 risk scoring engine with completeness tracking
- **Reporting:**
  - **PDF Reports:** Generated via ReportLab
  - **DOCX Reports:** Generated via python-docx

---

## 2. Cyber-Green Design System

The platform adheres to an enterprise cybersecurity operations center aesthetic:
- **Main Background:** `#07110D`
- **Secondary Background:** `#0B1711`
- **Sidebar Background:** `#08130E`
- **Card Background:** `#0E1D15`
- **Elevated Surface:** `#12271B`
- **Primary Neon Green:** `#39FF88`
- **Secondary Green:** `#19C96B`
- **Muted Green:** `#729B81`
- **Primary Text:** `#E8F5EC`
- **Secondary Text:** `#9CB4A3`
- **Border:** `#20392A`
- **Critical Severity:** `#FF4D5A`
- **High Severity:** `#FF9B50`
- **Medium Severity:** `#FFD166`
- **Low Severity:** `#39FF88`

---

## 3. Platform Navigation

The persistent shell features 11 dedicated cybersecurity views:
1. **Overview (`/`):** High-level SOC dashboard, radar charts, live connectivity ticker, aggregate risk gauge.
2. **Model Inventory (`/models`):** Full CRUD catalog for Traditional ML, Deep Learning, and LLM models.
3. **New Security Scan (`/scans/new`):** 4-step guided wizard for model selection, module toggling, parameters, and review.
4. **Scan History (`/scans`):** Audit trail of executed scans with status badges, durations, and risk scores.
5. **Risk Findings (`/findings`):** Security findings registry with severity filters and status workflows (Open, In Progress, Resolved, Accepted).
6. **Fairness & Bias (`/fairness`):** Demographic parity differences, equalized odds, and subgroup selection rates.
7. **Privacy Analysis (`/privacy`):** PII pattern exposure checks, memorization probes, and inference telemetry inspection.
8. **LLM Security (`/llm-security`):** OWASP Top 10 for LLMs test probes (prompt injection, jailbreak bypasses, secret extraction).
9. **Compliance Center (`/compliance`):** NIST AI RMF 1.0 mapping across Govern, Map, Measure, and Manage functions.
10. **Reports (`/reports`):** Downloadable executive and technical PDF and DOCX dossiers.
11. **Settings (`/settings`):** Local services diagnostic console, MongoDB Compass inspection instructions, and Atlas migration guide.

---

## 4. Setup and Installation (Windows PowerShell)

### Step 1: Verify Prerequisites
```powershell
node -v      # v18+ required (tested on v24.18.1)
npm -v       # v10+ required
python --version  # 3.10+ required (tested on 3.13.5)
Get-Service -Name MongoDB  # Must be Running
```

### Step 2: Backend Setup
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
pip install scikit-learn reportlab python-docx
```

Run automated backend tests:
```powershell
pytest ../backend/tests -v
```

Start the FastAPI backend server:
```powershell
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```
- API Base URL: `http://127.0.0.1:8000`
- Swagger UI Documentation: `http://127.0.0.1:8000/docs`
- Liveness Probe: `http://127.0.0.1:8000/api/health`
- Readiness Probe: `http://127.0.0.1:8000/api/ready`

### Step 3: Frontend Setup (Non-Vite Webpack 5)
Open a separate PowerShell terminal:
```powershell
cd frontend
npm install
npm start
```
- Access application in browser: `http://localhost:3000`

To build the optimized production bundle:
```powershell
npm run build
```

---

## 5. MongoDB Database & Compass Inspection

### Collections in `ai_sentinel`
- `models`: Registered AI models, metadata, risk categories, and architecture tiers.
- `scans`: Security scan records, execution states, progress, module results, and risk scores.
- `findings`: Detailed vulnerability records, empirical evidence, severity, and remediation statuses.
- `reports`: Metadata for compiled PDF and DOCX dossiers.
- `compliance_mappings`: NIST AI RMF 1.0 control evidence linkages.
- `audit_logs`: Timestamped system audit events and diagnostic records.

### Visual Inspection with MongoDB Compass
1. Launch **MongoDB Compass**.
2. Connect to: `mongodb://127.0.0.1:27017`.
3. In the left database list, click on **`ai_sentinel`**.
4. Browse and filter documents in `models`, `scans`, and `findings`.

---

## 6. Migration to MongoDB Atlas (Production)

To migrate from the local MongoDB instance to MongoDB Atlas:
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Obtain your connection string.
3. Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DB_NAME=ai_sentinel
   ```
4. Restart FastAPI. No application code changes are required.

---

## 7. Database Backup & Restore

### Local Backup:
```powershell
mongodump --uri="mongodb://127.0.0.1:27017/ai_sentinel" --out="./backup"
```

### Local Restore:
```powershell
mongorestore --uri="mongodb://127.0.0.1:27017/ai_sentinel" ./backup/ai_sentinel
```

---

## 8. License & Attribution

AI Sentinel is developed as an enterprise automated AI model risk assessment and governance platform. All rights reserved.
