from backend.app.database.session import get_database
from backend.app.core.logging import logger


async def create_indexes():
    """Create essential MongoDB indexes for optimal querying performance and data integrity."""
    try:
        db = get_database()
        logger.info("Initializing database indexes...")

        # Models collection indexes
        await db["models"].create_index("id", unique=True)
        await db["models"].create_index("name")
        await db["models"].create_index("created_at")

        # Scans collection indexes
        await db["scans"].create_index("id", unique=True)
        await db["scans"].create_index("model_id")
        await db["scans"].create_index("status")
        await db["scans"].create_index("created_at")

        # Findings collection indexes
        await db["findings"].create_index("id", unique=True)
        await db["findings"].create_index("model_id")
        await db["findings"].create_index("scan_id")
        await db["findings"].create_index("severity")
        await db["findings"].create_index("status")

        # Reports collection indexes
        await db["reports"].create_index("id", unique=True)
        await db["reports"].create_index("scan_id")
        await db["reports"].create_index("created_at")

        # Compliance mappings collection indexes
        await db["compliance_mappings"].create_index("id", unique=True)
        await db["compliance_mappings"].create_index("framework")
        await db["compliance_mappings"].create_index("category")

        # Audit logs collection indexes
        await db["audit_logs"].create_index("timestamp")
        await db["audit_logs"].create_index("action")

        logger.info("Database indexes successfully ensured.")
    except Exception as e:
        logger.warning(f"Could not initialize database indexes: {e}")
