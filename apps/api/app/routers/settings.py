from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from pathlib import Path
from app.core.config import settings

router = APIRouter(prefix="/settings", tags=["Settings"])

class ApiKeysPayload(BaseModel):
    jsearch_api_key: Optional[str] = None
    jsearch_search_key: Optional[str] = None
    jsearch_details_key: Optional[str] = None
    jsearch_salary_key: Optional[str] = None
    jsearch_company_salary_key: Optional[str] = None

def mask_key(key: Optional[str]) -> Optional[str]:
    if not key:
        return ""
    if len(key) <= 8:
        return "****"
    return f"{key[:8]}...{key[-4:]}"

@router.get("/keys")
async def get_keys():
    """Get the configuration status of the 4 RapidAPI JSearch endpoints."""
    return {
        "jsearch_api_key": {
            "configured": bool(settings.JSEARCH_API_KEY),
            "masked": mask_key(settings.JSEARCH_API_KEY)
        },
        "jsearch_search_key": {
            "configured": bool(settings.get_search_key()),
            "masked": mask_key(settings.get_search_key())
        },
        "jsearch_details_key": {
            "configured": bool(settings.get_details_key()),
            "masked": mask_key(settings.get_details_key())
        },
        "jsearch_salary_key": {
            "configured": bool(settings.get_salary_key()),
            "masked": mask_key(settings.get_salary_key())
        },
        "jsearch_company_salary_key": {
            "configured": bool(settings.get_company_salary_key()),
            "masked": mask_key(settings.get_company_salary_key())
        }
    }

@router.post("/keys")
async def update_keys(payload: ApiKeysPayload):
    """Save and update any of the 4 RapidAPI JSearch keys in runtime and persist to .env."""
    if payload.jsearch_api_key is not None:
        settings.JSEARCH_API_KEY = payload.jsearch_api_key.strip()
    if payload.jsearch_search_key is not None:
        settings.JSEARCH_SEARCH_KEY = payload.jsearch_search_key.strip()
    if payload.jsearch_details_key is not None:
        settings.JSEARCH_DETAILS_KEY = payload.jsearch_details_key.strip()
    if payload.jsearch_salary_key is not None:
        settings.JSEARCH_SALARY_KEY = payload.jsearch_salary_key.strip()
    if payload.jsearch_company_salary_key is not None:
        settings.JSEARCH_COMPANY_SALARY_KEY = payload.jsearch_company_salary_key.strip()

    # Persist to .env
    env_path = Path(__file__).resolve().parent.parent.parent / ".env"
    existing_lines = []
    if env_path.exists():
        existing_lines = env_path.read_text(encoding="utf-8").splitlines()

    env_dict = {}
    for line in existing_lines:
        line_clean = line.strip()
        if line_clean and not line_clean.startswith("#") and "=" in line_clean:
            k, v = line_clean.split("=", 1)
            env_dict[k.strip()] = v.strip()

    if settings.JSEARCH_API_KEY:
        env_dict["JSEARCH_API_KEY"] = f'"{settings.JSEARCH_API_KEY}"'
    if settings.JSEARCH_SEARCH_KEY:
        env_dict["JSEARCH_SEARCH_KEY"] = f'"{settings.JSEARCH_SEARCH_KEY}"'
    if settings.JSEARCH_DETAILS_KEY:
        env_dict["JSEARCH_DETAILS_KEY"] = f'"{settings.JSEARCH_DETAILS_KEY}"'
    if settings.JSEARCH_SALARY_KEY:
        env_dict["JSEARCH_SALARY_KEY"] = f'"{settings.JSEARCH_SALARY_KEY}"'
    if settings.JSEARCH_COMPANY_SALARY_KEY:
        env_dict["JSEARCH_COMPANY_SALARY_KEY"] = f'"{settings.JSEARCH_COMPANY_SALARY_KEY}"'

    new_content = "\n".join(f"{k}={v}" for k, v in env_dict.items()) + "\n"
    env_path.write_text(new_content, encoding="utf-8")

    return {"status": "success", "message": "API keys updated successfully"}
