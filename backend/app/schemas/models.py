from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import uuid
from pydantic import BaseModel, Field, field_validator


class ModelBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Unique model name")
    model_type: str = Field(..., description="Traditional ML, Deep Learning, or LLM")
    description: Optional[str] = Field(None, max_length=1000)
    version: str = Field("1.0.0", max_length=20)
    framework: str = Field("scikit-learn", max_length=50)
    source_type: str = Field("Local Weights File", max_length=50)
    owner: str = Field("Security & ML Team", max_length=100)
    environment: str = Field("Development", description="Development, Staging, or Production")
    intended_use: Optional[str] = Field(None, max_length=500)
    risk_category: str = Field("Medium", description="Low, Medium, High, or Critical")
    api_endpoint: Optional[str] = Field(None, max_length=500)

    @field_validator("model_type")
    @classmethod
    def validate_model_type(cls, v: str) -> str:
        allowed = ["Traditional ML", "Deep Learning", "LLM"]
        if v not in allowed:
            raise ValueError(f"model_type must be one of {allowed}")
        return v

    @field_validator("environment")
    @classmethod
    def validate_environment(cls, v: str) -> str:
        allowed = ["Development", "Staging", "Production"]
        if v not in allowed:
            raise ValueError(f"environment must be one of {allowed}")
        return v

    @field_validator("risk_category")
    @classmethod
    def validate_risk_category(cls, v: str) -> str:
        allowed = ["Low", "Medium", "High", "Critical"]
        if v not in allowed:
            raise ValueError(f"risk_category must be one of {allowed}")
        return v

    @field_validator("api_endpoint")
    @classmethod
    def validate_api_endpoint(cls, v: Optional[str]) -> Optional[str]:
        if v:
            v_lower = v.lower().strip()
            # SSRF Protection: forbid loopback/internal metadata endpoints if specified
            forbidden = ["169.254.169.254", "metadata.google.internal", "localhost", "127.0.0.1", "0.0.0.0"]
            for bad in forbidden:
                if bad in v_lower:
                    raise ValueError(f"Security Policy: Target endpoint cannot point to restricted internal IP '{bad}'")
        return v


class ModelCreate(ModelBase):
    pass


class ModelUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    model_type: Optional[str] = None
    description: Optional[str] = None
    version: Optional[str] = None
    framework: Optional[str] = None
    owner: Optional[str] = None
    environment: Optional[str] = None
    intended_use: Optional[str] = None
    risk_category: Optional[str] = None
    api_endpoint: Optional[str] = None


class ModelResponse(ModelBase):
    id: str
    file_metadata: Optional[Dict[str, Any]] = None
    created_at: str
    updated_at: str
    scans_count: int = 0
    open_findings_count: int = 0
