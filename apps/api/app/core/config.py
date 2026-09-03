from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+aiosqlite:///./career_companion.db"
    JSEARCH_API_KEY: Optional[str] = ""
    ADZUNA_APP_ID: Optional[str] = ""
    ADZUNA_APP_KEY: Optional[str] = ""
    OPENAI_API_KEY: Optional[str] = ""
    UPLOADS_DIR: str = "uploads"
    MAX_FILE_SIZE_BYTES: int = 10 * 1024 * 1024  # 10MB
    APP_NAME: str = "Career Companion API"

    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')


settings = Settings()
