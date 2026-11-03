from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+aiosqlite:///./career_companion.db"
    
    # RapidAPI JSearch Suite (supports single shared key or 4 separate keys)
    JSEARCH_API_KEY: Optional[str] = "86d2655e8cmshbe7664027232ce4p1a0b4djsnd144712c6216"
    JSEARCH_SEARCH_KEY: Optional[str] = ""
    JSEARCH_DETAILS_KEY: Optional[str] = ""
    JSEARCH_SALARY_KEY: Optional[str] = ""
    JSEARCH_COMPANY_SALARY_KEY: Optional[str] = ""
    
    ADZUNA_APP_ID: Optional[str] = ""
    ADZUNA_APP_KEY: Optional[str] = ""
    OPENAI_API_KEY: Optional[str] = ""
    UPLOADS_DIR: str = "uploads"
    MAX_FILE_SIZE_BYTES: int = 10 * 1024 * 1024  # 10MB
    APP_NAME: str = "Career Companion API"

    model_config = SettingsConfigDict(
        env_file=('.env', 'apps/api/.env', '../.env'),
        env_file_encoding='utf-8',
        extra='ignore'
    )

    def get_search_key(self) -> str:
        return (self.JSEARCH_SEARCH_KEY or self.JSEARCH_API_KEY or "").strip()

    def get_details_key(self) -> str:
        return (self.JSEARCH_DETAILS_KEY or self.JSEARCH_API_KEY or "").strip()

    def get_salary_key(self) -> str:
        return (self.JSEARCH_SALARY_KEY or self.JSEARCH_API_KEY or "").strip()

    def get_company_salary_key(self) -> str:
        return (self.JSEARCH_COMPANY_SALARY_KEY or self.JSEARCH_API_KEY or "").strip()


settings = Settings()
