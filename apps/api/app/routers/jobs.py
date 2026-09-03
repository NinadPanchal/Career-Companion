from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.services.skill_extractor import extract_skills
from app.core.database import get_db
from app.models.job import Job, JobSkill
from app.models.skill import Skill
from app.models.resume import Resume
from app.schemas.job import (
    JobCreate, JobRead, JobMatchRequest, JobMatchResponse, 
    DiscoveredJobRead, JobSaveFromDiscovery
)
from app.services.job_discovery import job_discovery
from app.services.job_matcher import calculate_match

router = APIRouter(prefix="/jobs", tags=["Jobs"])

async def get_or_create_skill(db: AsyncSession, skill_name: str) -> Skill:
    result = await db.execute(select(Skill).where(Skill.name == skill_name))
    skill = result.scalars().first()
    if not skill:
        skill = Skill(name=skill_name)
        db.add(skill)
        await db.flush()
    return skill

@router.post("/match", response_model=JobMatchResponse)
async def match_job(request: JobMatchRequest, db: AsyncSession = Depends(get_db)):
    """Compare a resume's known skills with skills mentioned in a job description."""
    resume_skills = request.resume_skills
    if request.resume_id:
        result = await db.execute(select(Resume).where(Resume.id == request.resume_id))
        resume = result.scalars().first()
        if resume:
            await db.refresh(resume, ['skills'])
            resume_skills = []
            for rs in resume.skills:
                await db.refresh(rs, ['skill'])
                resume_skills.append(rs.skill.name)
                
    match_result = calculate_match(
        resume_skills=resume_skills,
        job_description=request.description
    )

    return JobMatchResponse(
        match_score=match_result["match_score"],
        job_skills=match_result["job_skills"],
        matched_skills=match_result["matched_skills"],
        missing_skills=match_result["missing_skills"],
    )

@router.get("", response_model=List[JobRead])
async def list_jobs(page: int = Query(1, ge=1), per_page: int = Query(20, ge=1, le=100), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Job).offset((page - 1) * per_page).limit(per_page))
    jobs = result.scalars().all()
    
    response = []
    for job in jobs:
        await db.refresh(job, ['skills'])
        skill_names = []
        for js in job.skills:
            await db.refresh(js, ['skill'])
            skill_names.append(js.skill.name)
        
        j_dict = {
            "id": job.id,
            "title": job.title,
            "company_name": job.company_name,
            "location": job.location,
            "is_remote": job.is_remote,
            "salary_min": job.salary_min,
            "salary_max": job.salary_max,
            "currency": job.currency,
            "url": job.url,
            "source": job.source,
            "posted_at": job.posted_at,
            "created_at": job.created_at,
            "skills": skill_names
        }
        response.append(JobRead(**j_dict))
    return response

@router.get("/discover", response_model=List[DiscoveredJobRead])
async def discover_jobs(
    query: str,
    location: Optional[str] = None,
    remote_only: bool = False,
    page: int = 1,
    db: AsyncSession = Depends(get_db)
):
    discovered = await job_discovery.search(
        query=query, location=location, remote_only=remote_only, page=page
    )
    
    # Get primary resume for matching
    result = await db.execute(select(Resume).where(Resume.is_primary == True).limit(1))
    primary_resume = result.scalars().first()
    
    resume_skills = []
    target_role = None
    if primary_resume:
        target_role = primary_resume.target_role
        await db.refresh(primary_resume, ['skills'])
        for rs in primary_resume.skills:
            await db.refresh(rs, ['skill'])
            resume_skills.append(rs.skill.name)
            
    response_jobs = []
    for job in discovered:
        job_dict = job.model_dump()
        if primary_resume and job.description:
            match_res = calculate_match(
                resume_skills=resume_skills,
                job_description=job.description,
                job_title=job.title,
                target_role=target_role
            )
            job_dict["match_score"] = match_res["match_score"]
            job_dict["matched_skills"] = match_res["matched_skills"]
            job_dict["missing_skills"] = match_res["missing_skills"]
            
        response_jobs.append(DiscoveredJobRead(**job_dict))
        
    return response_jobs

@router.post("/discover/save", response_model=JobRead)
async def save_discovered_job(job_in: JobSaveFromDiscovery, db: AsyncSession = Depends(get_db)):
    # Check if exists
    result = await db.execute(
        select(Job).where(Job.source == job_in.source, Job.url == job_in.url)
    )
    existing_job = result.scalars().first()
    if existing_job:
        await db.refresh(existing_job, ['skills'])
        skill_names = []
        for js in existing_job.skills:
            await db.refresh(js, ['skill'])
            skill_names.append(js.skill.name)
        
        j_dict = {
            "id": existing_job.id,
            "title": existing_job.title,
            "company_name": existing_job.company_name,
            "location": existing_job.location,
            "is_remote": existing_job.is_remote,
            "salary_min": existing_job.salary_min,
            "salary_max": existing_job.salary_max,
            "currency": existing_job.currency,
            "url": existing_job.url,
            "source": existing_job.source,
            "posted_at": existing_job.posted_at,
            "created_at": existing_job.created_at,
            "skills": skill_names
        }
        return JobRead(**j_dict)
        
    # Create new
    job = Job(
        title=job_in.title,
        company_name=job_in.company_name,
        location=job_in.location,
        is_remote=job_in.is_remote,
        salary_min=job_in.salary_min,
        salary_max=job_in.salary_max,
        currency=job_in.currency,
        description=job_in.description,
        url=job_in.url,
        source=job_in.source,
    )
    db.add(job)
    await db.flush()
    
    skills = []
    if job_in.description:
        skills = extract_skills(job_in.description)
        for skill_name in skills:
            skill_obj = await get_or_create_skill(db, skill_name)
            js = JobSkill(job_id=job.id, skill_id=skill_obj.id)
            db.add(js)
            
    await db.commit()
    await db.refresh(job)
    
    j_dict = {
        "id": job.id,
        "title": job.title,
        "company_name": job.company_name,
        "location": job.location,
        "is_remote": job.is_remote,
        "salary_min": job.salary_min,
        "salary_max": job.salary_max,
        "currency": job.currency,
        "url": job.url,
        "source": job.source,
        "posted_at": job.posted_at,
        "created_at": job.created_at,
        "skills": skills
    }
    return JobRead(**j_dict)

@router.get("/{job_id}", response_model=JobRead)
async def get_job(job_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    await db.refresh(job, ['skills'])
    skill_names = []
    for js in job.skills:
        await db.refresh(js, ['skill'])
        skill_names.append(js.skill.name)
        
    j_dict = {
        "id": job.id,
        "title": job.title,
        "company_name": job.company_name,
        "location": job.location,
        "is_remote": job.is_remote,
        "salary_min": job.salary_min,
        "salary_max": job.salary_max,
        "currency": job.currency,
        "url": job.url,
        "source": job.source,
        "posted_at": job.posted_at,
        "created_at": job.created_at,
        "skills": skill_names
    }
    return JobRead(**j_dict)

@router.post("", response_model=JobRead)
async def create_job(job_in: JobCreate, db: AsyncSession = Depends(get_db)):
    job = Job(
        title=job_in.title,
        company_name=job_in.company_name,
        location=job_in.location,
        is_remote=job_in.is_remote,
        salary_min=job_in.salary_min,
        salary_max=job_in.salary_max,
        currency=job_in.currency,
        description=job_in.description,
        url=job_in.url,
        source=job_in.source,
    )
    db.add(job)
    await db.flush()
    
    skills = []
    if job_in.description:
        skills = extract_skills(job_in.description)
        for skill_name in skills:
            skill_obj = await get_or_create_skill(db, skill_name)
            js = JobSkill(job_id=job.id, skill_id=skill_obj.id)
            db.add(js)
            
    await db.commit()
    
    j_dict = {
        "id": job.id,
        "title": job.title,
        "company_name": job.company_name,
        "location": job.location,
        "is_remote": job.is_remote,
        "salary_min": job.salary_min,
        "salary_max": job.salary_max,
        "currency": job.currency,
        "url": job.url,
        "source": job.source,
        "posted_at": job.posted_at,
        "created_at": job.created_at,
        "skills": skills
    }
    return JobRead(**j_dict)

@router.delete("/{job_id}", status_code=204)
async def delete_job(job_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    await db.delete(job)
    await db.commit()
    return

