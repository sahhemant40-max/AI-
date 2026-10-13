from pydantic import BaseModel
from typing import Optional, Dict, Any


class HealthResponse(BaseModel):
    status: str
    service: str = "ai-sentinel-backend"
    version: str = "1.0.0"
    environment: str
    timestamp: str


class DatabaseStatus(BaseModel):
    connected: bool
    database_name: str
    uri_sanitized: str
    latency_ms: Optional[float] = None
    error: Optional[str] = None


class StorageStatus(BaseModel):
    uploads_dir: str
    reports_dir: str
    uploads_writable: bool
    reports_writable: bool


class ReadinessResponse(BaseModel):
    ready: bool
    status: str
    database: DatabaseStatus
    storage: StorageStatus
    timestamp: str


class TestDbRecordRequest(BaseModel):
    note: Optional[str] = "Health verification ping"


class TestDbRecordResponse(BaseModel):
    success: bool
    message: str
    record_id: str
    inserted_at: str
    retrieved_data: Dict[str, Any]
