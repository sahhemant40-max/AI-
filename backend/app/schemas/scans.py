from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class ScanCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    model_id: str = Field(..., description="Target model public ID")
    intensity: str = Field("comprehensive", description="quick, comprehensive, or deep")
    modules: List[str] = Field(..., min_length=1, description="List of modules e.g. ['robustness', 'fairness', 'privacy', 'llm_security']")
    parameters: Optional[Dict[str, Any]] = Field(default_factory=dict)


class ScanResponse(BaseModel):
    id: str
    name: str
    model_id: str
    model_name: Optional[str] = None
    intensity: str
    modules: List[str]
    parameters: Dict[str, Any]
    status: str  # queued, running, completed, failed, cancelled
    progress_percentage: int = 0
    current_stage: Optional[str] = None
    risk_score: Optional[int] = None
    risk_category: Optional[str] = None
    completeness: Optional[float] = None
    started_at: str
    completed_at: Optional[str] = None
    duration_seconds: Optional[float] = None
    findings_count: int = 0
    results: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
