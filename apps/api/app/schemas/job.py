from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field

class JobCreate(BaseModel):
    title: str
    company_name: str
    location: Optional[str] = None
    is_remote: bool = False
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    currency: str = 'USD'
    description: Optional[str] = None
    url: Optional[str] = None
    source: Optional[str] = None

class JobRead(BaseModel):
    id: int
    title: str
    company_name: str
    location: Optional[str] = None
    is_remote: bool
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    currency: str
    url: Optional[str] = None
    source: Optional[str] = None
    posted_at: Optional[datetime] = None
    created_at: datetime
    skills: List[str] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)

class JobMatchRequest(BaseModel):
    description: str = Field(min_length=20)
    resume_id: Optional[int] = None
    resume_skills: List[str] = Field(default_factory=list)

class JobMatchResponse(BaseModel):
    match_score: int
    job_skills: List[str]
    matched_skills: List[str]
    missing_skills: List[str]

class JobSearchParams(BaseModel):
    query: Optional[str] = None
    location: Optional[str] = None
    remote_only: bool = False
    page: int = 1
    per_page: int = 20

class DiscoveredJobRead(BaseModel):
    external_id: str
    title: str
    company_name: str
    location: Optional[str] = None
    is_remote: bool = False
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    currency: str = "USD"
    description: Optional[str] = None
    url: Optional[str] = None
    source: str
    posted_at: Optional[str] = None
    match_score: Optional[int] = None
    matched_skills: list[str] = Field(default_factory=list)
    missing_skills: list[str] = Field(default_factory=list)

class JobSaveFromDiscovery(BaseModel):
    external_id: str
    title: str
    company_name: str
    location: Optional[str] = None
    is_remote: bool = False
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    currency: str = "USD"
    description: Optional[str] = None
    url: Optional[str] = None
    source: str
