import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app
from backend.app.database.session import connect_to_mongo, close_mongo_connection


@pytest.mark.asyncio
async def test_model_crud_lifecycle():
    await connect_to_mongo()
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # 1. Create Model
            payload = {
                "name": "FraudDetection-Ensemble-v1",
                "model_type": "Traditional ML",
                "description": "Gradient boosted classifier predicting financial transaction anomalies.",
                "version": "1.2.0",
                "framework": "scikit-learn",
                "owner": "Financial Risk SecOps",
                "environment": "Staging",
                "intended_use": "Transaction fraud classification",
                "risk_category": "High",
            }
            create_resp = await client.post("/api/models", json=payload)
            assert create_resp.status_code == 201
            created = create_resp.json()
            model_id = created["id"]
            assert created["name"] == "FraudDetection-Ensemble-v1"
            assert created["risk_category"] == "High"

            # 2. Get Model by ID
            get_resp = await client.get(f"/api/models/{model_id}")
            assert get_resp.status_code == 200
            assert get_resp.json()["id"] == model_id

            # 3. List Models
            list_resp = await client.get("/api/models")
            assert list_resp.status_code == 200
            models_list = list_resp.json()
            assert any(m["id"] == model_id for m in models_list)

            # 4. Update Model
            update_resp = await client.put(
                f"/api/models/{model_id}",
                json={"environment": "Production", "version": "1.3.0"}
            )
            assert update_resp.status_code == 200
            updated = update_resp.json()
            assert updated["environment"] == "Production"
            assert updated["version"] == "1.3.0"

            # 5. Delete Model
            del_resp = await client.delete(f"/api/models/{model_id}")
            assert del_resp.status_code == 200

            # 6. Verify Deletion
            get_del_resp = await client.get(f"/api/models/{model_id}")
            assert get_del_resp.status_code == 404
    finally:
        await close_mongo_connection()


@pytest.mark.asyncio
async def test_model_ssrf_validation():
    await connect_to_mongo()
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            payload = {
                "name": "MaliciousTarget-Model",
                "model_type": "LLM",
                "environment": "Development",
                "risk_category": "Critical",
                "api_endpoint": "http://169.254.169.254/latest/meta-data/",
            }
            resp = await client.post("/api/models", json=payload)
            assert resp.status_code == 422  # Pydantic validation error
    finally:
        await close_mongo_connection()
