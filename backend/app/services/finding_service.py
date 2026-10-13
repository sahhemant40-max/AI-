from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from backend.app.database.session import get_database
from backend.app.schemas.findings import FindingUpdate
from backend.app.core.errors import ResourceNotFoundException
from backend.app.core.logging import logger


async def list_findings(
    model_id: Optional[str] = None,
    scan_id: Optional[str] = None,
    severity: Optional[str] = None,
    status: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """List findings from MongoDB with optional multi-facet filters."""
    db = get_database()
    query = {}
    if model_id:
        query["model_id"] = model_id
    if scan_id:
        query["scan_id"] = scan_id
    if severity and severity.upper() != "ALL":
        query["severity"] = severity
    if status and status.upper() != "ALL":
        query["status"] = status

    cursor = db["findings"].find(query, {"_id": 0}).sort("created_at", -1)
    return await cursor.to_list(length=1000)


async def get_finding_by_id(finding_id: str) -> Dict[str, Any]:
    """Retrieve single finding by ID."""
    db = get_database()
    finding = await db["findings"].find_one({"id": finding_id}, {"_id": 0})
    if not finding:
        raise ResourceNotFoundException("Finding", finding_id)
    return finding


async def update_finding(finding_id: str, payload: FindingUpdate) -> Dict[str, Any]:
    """Update status or remediation notes for a finding."""
    db = get_database()
    now_iso = datetime.now(timezone.utc).isoformat()
    update_data = {
        "status": payload.status,
        "updated_at": now_iso,
    }
    if payload.remediation_notes is not None:
        update_data["remediation_notes"] = payload.remediation_notes

    res = await db["findings"].update_one({"id": finding_id}, {"$set": update_data})
    if res.matched_count == 0:
        raise ResourceNotFoundException("Finding", finding_id)

    logger.info(f"Updated finding {finding_id} status to '{payload.status}'")
    return await get_finding_by_id(finding_id)
