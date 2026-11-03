from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class ExperienceItem(BaseModel):
    company: str
    title: str
    start: Optional[str] = "2022"
    end: Optional[str] = "Present"
    bullets: List[str] = []


class EducationItem(BaseModel):
    institution: str
    degree: str
    field: Optional[str] = ""
    graduation_year: Optional[str] = ""


class ProjectItem(BaseModel):
    name: str
    description: Optional[str] = ""
    link: Optional[str] = ""
    bullets: List[str] = []


class ATSResult(BaseModel):
    score: int = 85
    issues: List[str] = []
    breakdown: Optional[Dict[str, Any]] = None


class CandidateProfileCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    headline: Optional[str] = None
    summary: Optional[str] = None
    links: Optional[Dict[str, Any]] = Field(default_factory=dict)
    skills: List[str] = Field(default_factory=list)
    experience: List[ExperienceItem] = Field(default_factory=list)
    education: List[EducationItem] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)
    ats_score: Optional[int] = 85
    ats_issues: Optional[List[str]] = Field(default_factory=list)
    resume_id: Optional[int] = None
    resume_filename: Optional[str] = None


class CandidateProfileResponse(CandidateProfileCreate):
    id: int
    user_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    ats: Optional[ATSResult] = None


class ResumeParseResponse(BaseModel):
    profile: CandidateProfileCreate
    resume_id: int
    original_filename: str
    stored_filename: str
    word_count: int
    ats: ATSResult

