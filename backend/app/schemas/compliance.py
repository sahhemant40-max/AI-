from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class ComplianceControlResponse(BaseModel):
    id: str
    function: str  # GOVERN, MAP, MEASURE, MANAGE
    category: str
    title: str
    description: str
    evidence_mapping: str
    coverage_status: str  # IMPLEMENTED, IN_PROGRESS, GAP_IDENTIFIED
    coverage_percentage: int
    related_scans: List[str] = []
    recommended_actions: Optional[str] = None


class ComplianceFrameworkResponse(BaseModel):
    framework: str = "NIST AI RMF 1.0"
    version: str = "1.0"
    functions: Dict[str, List[ComplianceControlResponse]]
    overall_posture: str
    implemented_count: int
    total_count: int
