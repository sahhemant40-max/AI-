import os
import time
from datetime import datetime, timezone
import uuid
from fastapi import APIRouter, status, HTTPException
from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.database.session import check_mongo_connection, get_database, db_manager
from backend.app.schemas.health import (
    HealthResponse,
    ReadinessResponse,
    DatabaseStatus,
    StorageStatus,
    TestDbRecordRequest,
    TestDbRecordResponse,
)

router = APIRouter(prefix="/api", tags=["System Health & Diagnostics"])


@router.get("/health", response_model=HealthResponse, summary="Basic Liveness Probe")
async def health_check():
    """Liveness probe to confirm backend HTTP process is active and responsive."""
    return HealthResponse(
        status="healthy",
        service="ai-sentinel-backend",
        version="1.0.0",
        environment=settings.ENVIRONMENT,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@router.get("/ready", response_model=ReadinessResponse, summary="Readiness Probe with DB & Storage checks")
async def readiness_check():
    """Readiness probe that honestly validates MongoDB connectivity and storage path write permissions."""
    # 1. MongoDB Status Check
    start_time = time.perf_counter()
    db_connected, db_err = await check_mongo_connection()
    latency_ms = round((time.perf_counter() - start_time) * 1000, 2) if db_connected else None

    # Sanitize URI for safe display (hide credentials if present)
    safe_uri = "mongodb://127.0.0.1:27017"
    if "@" in settings.MONGODB_URI:
        parts = settings.MONGODB_URI.split("@")
        safe_uri = "mongodb+srv://****:****@" + parts[-1]
    elif settings.MONGODB_URI:
        safe_uri = settings.MONGODB_URI.split("?")[0]

    database_status = DatabaseStatus(
        connected=db_connected,
        database_name=settings.MONGODB_DB_NAME,
        uri_sanitized=safe_uri,
        latency_ms=latency_ms,
        error=db_err,
    )

    # 2. Storage Directory Check
    uploads_dir = os.path.abspath(settings.UPLOAD_DIR)
    reports_dir = os.path.abspath(settings.REPORTS_DIR)
    os.makedirs(uploads_dir, exist_ok=True)
    os.makedirs(reports_dir, exist_ok=True)

    uploads_writable = os.access(uploads_dir, os.W_OK)
    reports_writable = os.access(reports_dir, os.W_OK)

    storage_status = StorageStatus(
        uploads_dir=uploads_dir,
        reports_dir=reports_dir,
        uploads_writable=uploads_writable,
        reports_writable=reports_writable,
    )

    is_ready = db_connected and uploads_writable and reports_writable
    status_str = "ready" if is_ready else "degraded"

    return ReadinessResponse(
        ready=is_ready,
        status=status_str,
        database=database_status,
        storage=storage_status,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@router.post("/test-db", response_model=TestDbRecordResponse, summary="Write & Read Test Record in MongoDB")
async def test_db_operations(payload: TestDbRecordRequest):
    """
    Diagnostic endpoint: Creates a test record in MongoDB 'audit_logs', reads it back, 
    and returns it to verify full read/write database functionality.
    """
    db_connected, err = await check_mongo_connection()
    if not db_connected:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database unavailable: {err}. Ensure local MongoDB Community Server is running on port 27017.",
        )

    try:
        db = get_database()
        test_id = f"test-{uuid.uuid4().hex[:8]}"
        now = datetime.now(timezone.utc).isoformat()

        doc = {
            "id": test_id,
            "type": "diagnostic_probe",
            "note": payload.note,
            "source": "api_test_endpoint",
            "created_at": now,
        }

        # Insert document
        await db["audit_logs"].insert_one(doc)

        # Retrieve document back
        retrieved = await db["audit_logs"].find_one({"id": test_id}, {"_id": 0})
        if not retrieved:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Inserted test document could not be retrieved from MongoDB.",
            )

        logger.info(f"Verified MongoDB write/read with test record ID: {test_id}")
        return TestDbRecordResponse(
            success=True,
            message="MongoDB write and read verification successful.",
            record_id=test_id,
            inserted_at=now,
            retrieved_data=retrieved,
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error testing DB write/read: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"MongoDB operation failed: {str(e)}",
        )
