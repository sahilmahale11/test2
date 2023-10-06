import logging
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.common.env_config import settings
from tenacity import retry, stop_after_attempt, wait_fixed, before_log, after_log
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import database_exists, create_database
from app.common.env_config import settings
from app.common.api_logging import logger



#For ALembic metadata linkage in Datamodeler (alembic/env.py)
DATABASE_URL = str(settings.SQLALCHEMY_DATABASE_URI)
engine = create_engine(DATABASE_URL)
metadata = MetaData()
metadata.bind = engine
Base = declarative_base(metadata=metadata)

max_tries = 60 * 5  # 5 minutes
wait_seconds = 1


@retry(
    stop=stop_after_attempt(max_tries),
    wait=wait_fixed(wait_seconds),
    before=before_log(logger, logging.INFO),
    after=after_log(logger, logging.WARN),
)
def get_db_engine():
    try:
        engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20,
            pool_timeout=30,
        )
        if not database_exists(engine.url):
            create_database(engine.url)
        return engine
    except Exception as e:
        logger.error(e)
        raise e

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=get_db_engine())

def get_db():
    try:
        db = SessionLocal()
        return db
    finally:
        db.close()