from typing import List, Optional
from fastapi import APIRouter, status, Query
from backend.app.schemas.scans import ScanCreate, ScanResponse
from backend.app.services import scan_service

router = APIRouter(prefix="/api/scans", tags=["Security Scans"])


@router.get("", response_model=List[ScanResponse], summary="List all security scans")
async def list_scans(
    model_id: Optional[str] = Query(None, description="Filter by model ID"),
    status: Optional[str] = Query(None, description="Filter by status (completed, running, queued, failed)"),
):
    """Retrieve security scan executions, live progress, and risk scores."""
    return await scan_service.list_scans(model_id=model_id, status=status)


@router.post("", response_model=ScanResponse, status_code=status.HTTP_201_CREATED, summary="Create and execute scan")
async def create_scan(payload: ScanCreate):
    """Launch an automated vulnerability, fairness, privacy, and LLM safety scan."""
    return await scan_service.create_and_execute_scan(payload)


@router.get("/{scan_id}", response_model=ScanResponse, summary="Get scan details")
async def get_scan(scan_id: str):
    """Retrieve execution breakdown, module metrics, and telemetry for a specific scan."""
    return await scan_service.get_scan_by_id(scan_id)
