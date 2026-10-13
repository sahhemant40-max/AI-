from typing import Optional, Any
from pydantic import BaseModel, Field


class FindingUpdate(BaseModel):
    status: str = Field(..., description="open, in_progress, resolved, accepted")
    remediation_notes: Optional[str] = None


class FindingResponse(BaseModel):
    id: str
    scan_id: str
    model_id: str
    model_name: Optional[str] = None
    module: str
    test_name: str
    severity: str  # Critical, High, Medium, Low
    title: str
    description: str
    evidence: Any
    potential_impact: Optional[str] = None
    remediation: Optional[str] = None
    status: str  # open, in_progress, resolved, accepted
    created_at: str
    updated_at: str
