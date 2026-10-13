from datetime import datetime, timezone
import uuid
from typing import List, Optional, Dict, Any
from backend.app.database.session import get_database
from backend.app.schemas.models import ModelCreate, ModelUpdate, ModelResponse
from backend.app.core.errors import ResourceNotFoundException, DatabaseException
from backend.app.core.logging import logger


async def list_models() -> List[Dict[str, Any]]:
    """Retrieve all registered models from MongoDB with aggregate stats."""
    db = get_database()
    cursor = db["models"].find({}, {"_id": 0}).sort("created_at", -1)
    models = await cursor.to_list(length=500)

    # Attach scan counts and finding counts for each model
    for m in models:
        model_id = m.get("id")
        m["scans_count"] = await db["scans"].count_documents({"model_id": model_id})
        m["open_findings_count"] = await db["findings"].count_documents({
            "model_id": model_id,
            "status": "open"
        })

    return models


async def get_model_by_id(model_id: str) -> Dict[str, Any]:
    """Retrieve single model by its public ID."""
    db = get_database()
    model = await db["models"].find_one({"id": model_id}, {"_id": 0})
    if not model:
        raise ResourceNotFoundException("Model", model_id)

    model["scans_count"] = await db["scans"].count_documents({"model_id": model_id})
    model["open_findings_count"] = await db["findings"].count_documents({
        "model_id": model_id,
        "status": "open"
    })
    return model


async def create_model(payload: ModelCreate) -> Dict[str, Any]:
    """Insert newly registered model into MongoDB."""
    db = get_database()
    model_id = f"mod-{uuid.uuid4().hex[:8]}"
    now = datetime.now(timezone.utc).isoformat()

    doc = payload.model_dump()
    doc["id"] = model_id
    doc["created_at"] = now
    doc["updated_at"] = now
    doc["scans_count"] = 0
    doc["open_findings_count"] = 0

    await db["models"].insert_one(doc)

    # Log to audit trail
    await db["audit_logs"].insert_one({
        "id": f"aud-{uuid.uuid4().hex[:8]}",
        "action": "MODEL_REGISTERED",
        "model_id": model_id,
        "model_name": payload.name,
        "timestamp": now,
    })

    logger.info(f"Registered new AI model: '{payload.name}' ({model_id})")
    # Fetch clean doc without MongoDB _id
    return await db["models"].find_one({"id": model_id}, {"_id": 0})


async def update_model(model_id: str, payload: ModelUpdate) -> Dict[str, Any]:
    """Update fields on an existing model."""
    db = get_database()
    existing = await db["models"].find_one({"id": model_id})
    if not existing:
        raise ResourceNotFoundException("Model", model_id)

    update_fields = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update_fields:
        return await get_model_by_id(model_id)

    now = datetime.now(timezone.utc).isoformat()
    update_fields["updated_at"] = now

    await db["models"].update_one({"id": model_id}, {"$set": update_fields})
    logger.info(f"Updated model: {model_id}")
    return await get_model_by_id(model_id)


async def delete_model(model_id: str) -> bool:
    """Remove a model from inventory."""
    db = get_database()
    result = await db["models"].delete_one({"id": model_id})
    if result.deleted_count == 0:
        raise ResourceNotFoundException("Model", model_id)

    # Audit trail
    await db["audit_logs"].insert_one({
        "id": f"aud-{uuid.uuid4().hex[:8]}",
        "action": "MODEL_DELETED",
        "model_id": model_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })
    logger.info(f"Deleted model: {model_id}")
    return True
