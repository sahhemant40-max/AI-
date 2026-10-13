import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.core.errors import (
    AppException,
    app_exception_handler,
    unhandled_exception_handler,
)
from backend.app.database.session import connect_to_mongo, close_mongo_connection
from backend.app.database.indexes import create_indexes
from backend.app.routers import health, models, scans, findings, reports, compliance


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure directories, connect MongoDB, initialize indexes
    logger.info("Starting AI Sentinel Backend...")
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(settings.REPORTS_DIR, exist_ok=True)

    await connect_to_mongo()
    await create_indexes()
    
    yield
    
    # Shutdown
    logger.info("Shutting down AI Sentinel Backend...")
    await close_mongo_connection()


app = FastAPI(
    title="AI SENTINEL — AI Model Risk Assessment & Governance API",
    description="""
    ## AI SENTINEL API
    **Tagline:** Secure AI. Measure Risk. Build Trust.

    Enterprise cybersecurity API for automated AI model risk assessment, bias auditing, 
    adversarial robustness evaluation, privacy leakage detection, and NIST AI RMF compliance governance.
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Configure CORS
origins = settings.ALLOWED_ORIGINS
if isinstance(origins, str):
    origins = [o.strip() for o in origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

# Register Routers
app.include_router(health.router)
app.include_router(models.router)
app.include_router(scans.router)
app.include_router(findings.router)
app.include_router(reports.router)
app.include_router(compliance.router)


@app.get("/", tags=["Root"])
async def root():
    return {
        "platform": "AI SENTINEL",
        "tagline": "Secure AI. Measure Risk. Build Trust.",
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health",
        "ready": "/api/ready",
    }
