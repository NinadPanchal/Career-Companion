from fastapi import APIRouter
from pydantic import BaseModel, Field

from services.skill_extractor import extract_skills

router = APIRouter(prefix="/jobs", tags=["Jobs"])


class JobMatchRequest(BaseModel):
    description: str = Field(min_length=20, max_length=20_000)
    resume_skills: list[str] = Field(default_factory=list)


@router.post("/match")
def match_job(request: JobMatchRequest):
    """Compare a resume's known skills with skills mentioned in a job description."""
    job_skills = extract_skills(request.description)
    resume_skill_set = set(request.resume_skills)
    matched_skills = [skill for skill in job_skills if skill in resume_skill_set]
    missing_skills = [skill for skill in job_skills if skill not in resume_skill_set]
    match_score = round((len(matched_skills) / len(job_skills)) * 100) if job_skills else 0

    return {
        "match_score": match_score,
        "job_skills": job_skills,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
    }
