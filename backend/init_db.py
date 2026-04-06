import asyncio
import logging
import sys
import os

# Ensure the app folder is in the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base, init_pgvector
# Import all models to register with Base.metadata
from app.models import *

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def setup():
    logger.info("Initializing pgvector...")
    await init_pgvector()
    logger.info("Creating tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database setup complete.")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(setup())
