from datetime import datetime
from typing import Optional, Dict
from pydantic import BaseModel, ConfigDict

class ApplicationJobSummary(BaseModel):
    id: int
    title: str
    company_name: str
    location: Optional[str] = None
    url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class ApplicationCreate(BaseModel):
    job_id: int
    resume_id: Optional[int] = None
    status: Optional[str] = 'DISCOVERED'
    notes: Optional[str] = None

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    match_score: Optional[float] = None

class ApplicationRead(BaseModel):
    id: int
    user_id: int
    job_id: int
    resume_id: Optional[int] = None
    status: str
    match_score: Optional[float] = None
    applied_at: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    job: ApplicationJobSummary

    model_config = ConfigDict(from_attributes=True)

class ApplicationStats(BaseModel):
    total: int
    by_status: Dict[str, int]
    avg_match_score: Optional[float] = None
    applied_this_week: int
    applied_this_month: int
