import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app
from backend.app.database.session import connect_to_mongo, close_mongo_connection


@pytest.mark.asyncio
async def test_health_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "ai-sentinel-backend"
        assert "timestamp" in data


@pytest.mark.asyncio
async def test_readiness_and_db_persistence():
    # Connect database
    await connect_to_mongo()
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            ready_resp = await client.get("/api/ready")
            assert ready_resp.status_code == 200
            ready_data = ready_resp.json()
            assert ready_data["ready"] is True
            assert ready_data["database"]["connected"] is True
            assert ready_data["database"]["database_name"] == "ai_sentinel"

            # Test write and read back from MongoDB
            test_db_resp = await client.post(
                "/api/test-db",
                json={"note": "Pytest diagnostic test probe"}
            )
            assert test_db_resp.status_code == 200
            db_data = test_db_resp.json()
            assert db_data["success"] is True
            assert db_data["retrieved_data"]["note"] == "Pytest diagnostic test probe"
            assert "record_id" in db_data
    finally:
        await close_mongo_connection()
