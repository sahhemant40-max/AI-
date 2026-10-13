from typing import List, Optional
from fastapi import APIRouter, Query
from backend.app.schemas.findings import FindingUpdate, FindingResponse
from backend.app.services import finding_service

router = APIRouter(prefix="/api/findings", tags=["Risk & Vulnerability Findings"])


@router.get("", response_model=List[FindingResponse], summary="List security findings")
async def list_findings(
    model_id: Optional[str] = Query(None),
    scan_id: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
):
    """Retrieve all findings with optional severity or status filters."""
    return await finding_service.list_findings(
        model_id=model_id, scan_id=scan_id, severity=severity, status=status
    )


@router.get("/{finding_id}", response_model=FindingResponse, summary="Get single finding")
async def get_finding(finding_id: str):
    """Retrieve detailed description, evidence, and remediation guidance for a finding."""
    return await finding_service.get_finding_by_id(finding_id)


@router.patch("/{finding_id}", response_model=FindingResponse, summary="Update finding status")
async def update_finding(finding_id: str, payload: FindingUpdate):
    """Update finding status (open, in_progress, resolved, accepted) or remediation notes."""
    return await finding_service.update_finding(finding_id, payload)
