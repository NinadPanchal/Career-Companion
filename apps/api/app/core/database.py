import ssl
import sqlite3
from collections.abc import AsyncGenerator
from urllib.parse import urlparse, parse_qs, urlunparse, urlencode

from sqlalchemy import event
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

def setup_engine(raw_url: str):
    if not raw_url:
        raw_url = "sqlite+aiosqlite:///./career_companion.db"

    # Normalize protocol prefix
    if raw_url.startswith("postgres://"):
        raw_url = raw_url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif raw_url.startswith("postgresql://") and not raw_url.startswith("postgresql+"):
        raw_url = raw_url.replace("postgresql://", "postgresql+asyncpg://", 1)

    is_sqlite = raw_url.startswith("sqlite")
    engine_kwargs = {}

    if is_sqlite:
        engine_kwargs["connect_args"] = {"check_same_thread": False}
        return raw_url, engine_kwargs, is_sqlite
    
    # PostgreSQL / asyncpg configuration
    # asyncpg expects 'ssl' in connect_args rather than 'sslmode' in query params
    parsed = urlparse(raw_url)
    query_params = parse_qs(parsed.query)

    needs_ssl = (
        "sslmode" in query_params or 
        "ssl" in query_params or 
        "neon.tech" in (parsed.hostname or "")
    )

    # Clean query params unsupported by asyncpg
    query_params.pop("sslmode", None)
    query_params.pop("channel_binding", None)

    clean_query = urlencode(query_params, doseq=True)
    clean_url = urlunparse(parsed._replace(query=clean_query))

    connect_args = {}
    if needs_ssl:
        try:
            import certifi
            ssl_ctx = ssl.create_default_context(cafile=certifi.where())
        except Exception:
            ssl_ctx = ssl.create_default_context()
            ssl_ctx.check_hostname = False
            ssl_ctx.verify_mode = ssl.CERT_NONE
        connect_args["ssl"] = ssl_ctx

    engine_kwargs["connect_args"] = connect_args
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_recycle"] = 300

    return clean_url, engine_kwargs, is_sqlite

db_url, engine_kwargs, is_sqlite = setup_engine(settings.DATABASE_URL)

engine = create_async_engine(
    db_url,
    **engine_kwargs
)

if is_sqlite:
    @event.listens_for(engine.sync_engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        if isinstance(dbapi_connection, sqlite3.Connection):
            cursor = dbapi_connection.cursor()
            cursor.execute("PRAGMA foreign_keys=ON")
            cursor.execute("PRAGMA journal_mode=WAL")
            cursor.execute("PRAGMA synchronous=NORMAL")
            cursor.close()

async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

class Base(DeclarativeBase):
    pass

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
