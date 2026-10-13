from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class ReportCreate(BaseModel):
    scan_id: str = Field(..., description="Target completed scan ID")
    report_type: str = Field("Comprehensive Technical Audit")
    title: str = Field("AI Sentinel Risk Assessment Report")


class ReportResponse(BaseModel):
    id: str
    scan_id: str
    report_type: str
    title: str
    created_at: str
    pdf_path: Optional[str] = None
    docx_path: Optional[str] = None
    metadata: Dict[str, Any]
