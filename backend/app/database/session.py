from typing import Optional, Tuple
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from backend.app.core.config import settings
from backend.app.core.logging import logger


class DatabaseManager:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None


db_manager = DatabaseManager()


async def connect_to_mongo():
    """Connect to MongoDB and initialize client."""
    try:
        logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI} (DB: {settings.MONGODB_DB_NAME})...")
        db_manager.client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=settings.MONGODB_SERVER_SELECTION_TIMEOUT_MS,
        )
        db_manager.db = db_manager.client[settings.MONGODB_DB_NAME]
        
        # Verify connection immediately
        await db_manager.client.admin.command("ping")
        logger.info(f"Successfully connected to MongoDB database '{settings.MONGODB_DB_NAME}'.")
    except Exception as e:
        logger.error(f"MongoDB connection failed: {e}")
        # We do not crash the app so health/readiness endpoints can report database status honestly


async def close_mongo_connection():
    """Close MongoDB connection on application shutdown."""
    if db_manager.client:
        logger.info("Closing MongoDB connection...")
        db_manager.client.close()
        logger.info("MongoDB connection closed.")


async def check_mongo_connection() -> Tuple[bool, Optional[str]]:
    """Ping MongoDB to verify if database is currently responsive."""
    if not db_manager.client:
        return False, "MongoDB client is not initialized."
    try:
        await db_manager.client.admin.command("ping")
        return True, None
    except Exception as e:
        return False, str(e)


def get_database() -> AsyncIOMotorDatabase:
    """Return the active database instance."""
    if db_manager.db is None:
        raise RuntimeError("Database is not connected.")
    return db_manager.db


# Collection accessors
def get_collection(name: str):
    db = get_database()
    return db[name]
