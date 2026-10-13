from typing import List
from fastapi import APIRouter, status, Depends
from backend.app.schemas.models import ModelCreate, ModelUpdate, ModelResponse
from backend.app.services import model_service

router = APIRouter(prefix="/api/models", tags=["AI Model Inventory"])


@router.get("", response_model=List[ModelResponse], summary="List all registered AI models")
async def list_models():
    """Retrieve catalog of all registered models with vulnerability and scan counts."""
    return await model_service.list_models()


@router.post("", response_model=ModelResponse, status_code=status.HTTP_201_CREATED, summary="Register a new model")
async def create_model(payload: ModelCreate):
    """Register a new AI model for governance and vulnerability assessment."""
    return await model_service.create_model(payload)


@router.get("/{model_id}", response_model=ModelResponse, summary="Get model details")
async def get_model(model_id: str):
    """Retrieve detailed metadata and linked security audit telemetry for a specific model."""
    return await model_service.get_model_by_id(model_id)


@router.put("/{model_id}", response_model=ModelResponse, summary="Update model metadata")
async def update_model(model_id: str, payload: ModelUpdate):
    """Update description, environment, version, or risk parameters of a registered model."""
    return await model_service.update_model(model_id, payload)


@router.delete("/{model_id}", summary="Delete model from inventory")
async def delete_model(model_id: str):
    """Remove a model from the governance registry."""
    await model_service.delete_model(model_id)
    return {"success": True, "message": f"Model '{model_id}' successfully removed."}
