from typing import List, Optional
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.core.database import get_db
from app.models.application import Application, ApplicationStatus
from app.models.job import Job
from app.models.resume import Resume
from app.models.user import User
from app.schemas.application import (
    ApplicationCreate, ApplicationRead, ApplicationUpdate, 
    ApplicationStats, ApplicationJobSummary
)

router = APIRouter(prefix="/applications", tags=["Applications"])

async def get_or_create_default_user(db: AsyncSession) -> User:
    result = await db.execute(select(User).where(User.email == 'local@career-companion.app'))
    user = result.scalars().first()
    if not user:
        user = User(email='local@career-companion.app', full_name='Default User', hashed_password='not_used')
        db.add(user)
        await db.flush()
    return user

@router.get("", response_model=List[ApplicationRead])
async def list_applications(
    status: Optional[str] = None, 
    page: int = Query(1, ge=1), 
    per_page: int = Query(20, ge=1, le=100), 
    db: AsyncSession = Depends(get_db)
):
    user = await get_or_create_default_user(db)
    
    query = select(Application).where(Application.user_id == user.id)
    if status:
        query = query.where(Application.status == status)
        
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    applications = result.scalars().all()
    
    response = []
    for app in applications:
        await db.refresh(app, ['job'])
        app_dict = {
            "id": app.id,
            "user_id": app.user_id,
            "job_id": app.job_id,
            "resume_id": app.resume_id,
            "status": app.status,
            "match_score": app.match_score,
            "applied_at": app.applied_at,
            "notes": app.notes,
            "created_at": app.created_at,
            "updated_at": app.updated_at,
            "job": ApplicationJobSummary(
                id=app.job.id,
                title=app.job.title,
                company_name=app.job.company_name,
                location=app.job.location,
                url=app.job.url
            ) if app.job else None
        }
        response.append(ApplicationRead(**app_dict))
    return response

@router.post("", response_model=ApplicationRead)
async def create_application(app_in: ApplicationCreate, db: AsyncSession = Depends(get_db)):
    user = await get_or_create_default_user(db)
    
    # Verify job exists
    job_res = await db.execute(select(Job).where(Job.id == app_in.job_id))
    job = job_res.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    # Verify resume exists if provided
    if app_in.resume_id:
        res_res = await db.execute(select(Resume).where(Resume.id == app_in.resume_id))
        resume = res_res.scalars().first()
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
            
    application = Application(
        user_id=user.id,
        job_id=app_in.job_id,
        resume_id=app_in.resume_id,
        status=app_in.status or ApplicationStatus.DISCOVERED,
        notes=app_in.notes
    )
    db.add(application)
    await db.commit()
    await db.refresh(application)
    await db.refresh(application, ['job'])
    
    app_dict = {
        "id": application.id,
        "user_id": application.user_id,
        "job_id": application.job_id,
        "resume_id": application.resume_id,
        "status": application.status,
        "match_score": application.match_score,
        "applied_at": application.applied_at,
        "notes": application.notes,
        "created_at": application.created_at,
        "updated_at": application.updated_at,
        "job": ApplicationJobSummary(
            id=application.job.id,
            title=application.job.title,
            company_name=application.job.company_name,
            location=application.job.location,
            url=application.job.url
        ) if application.job else None
    }
    return ApplicationRead(**app_dict)

@router.get("/stats", response_model=ApplicationStats)
async def get_application_stats(db: AsyncSession = Depends(get_db)):
    user = await get_or_create_default_user(db)
    
    # Get total and by status
    result = await db.execute(select(Application.status, func.count(Application.id)).where(Application.user_id == user.id).group_by(Application.status))
    status_counts = dict(result.all())
    total = sum(status_counts.values())
    
    # Get average match score
    result_score = await db.execute(select(func.avg(Application.match_score)).where(Application.user_id == user.id, Application.match_score != None))
    avg_score = result_score.scalar()
    
    # Recent activity
    now = datetime.utcnow()
    one_week_ago = now - timedelta(days=7)
    one_month_ago = now - timedelta(days=30)
    
    result_week = await db.execute(select(func.count(Application.id)).where(Application.user_id == user.id, Application.status == ApplicationStatus.APPLIED, Application.applied_at >= one_week_ago))
    applied_week = result_week.scalar() or 0
    
    result_month = await db.execute(select(func.count(Application.id)).where(Application.user_id == user.id, Application.status == ApplicationStatus.APPLIED, Application.applied_at >= one_month_ago))
    applied_month = result_month.scalar() or 0
    
    return ApplicationStats(
        total=total,
        by_status=status_counts,
        avg_match_score=avg_score,
        applied_this_week=applied_week,
        applied_this_month=applied_month
    )

@router.get("/{app_id}", response_model=ApplicationRead)
async def get_application(app_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Application).where(Application.id == app_id))
    application = result.scalars().first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    await db.refresh(application, ['job'])
    
    app_dict = {
        "id": application.id,
        "user_id": application.user_id,
        "job_id": application.job_id,
        "resume_id": application.resume_id,
        "status": application.status,
        "match_score": application.match_score,
        "applied_at": application.applied_at,
        "notes": application.notes,
        "created_at": application.created_at,
        "updated_at": application.updated_at,
        "job": ApplicationJobSummary(
            id=application.job.id,
            title=application.job.title,
            company_name=application.job.company_name,
            location=application.job.location,
            url=application.job.url
        ) if application.job else None
    }
    return ApplicationRead(**app_dict)

@router.patch("/{app_id}", response_model=ApplicationRead)
async def update_application(app_id: int, app_in: ApplicationUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Application).where(Application.id == app_id))
    application = result.scalars().first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    if app_in.status is not None:
        if app_in.status == ApplicationStatus.APPLIED and application.status != ApplicationStatus.APPLIED:
            application.applied_at = datetime.utcnow()
        application.status = app_in.status
    if app_in.notes is not None:
        application.notes = app_in.notes
    if app_in.match_score is not None:
        application.match_score = app_in.match_score
        
    await db.commit()
    await db.refresh(application)
    await db.refresh(application, ['job'])
    
    app_dict = {
        "id": application.id,
        "user_id": application.user_id,
        "job_id": application.job_id,
        "resume_id": application.resume_id,
        "status": application.status,
        "match_score": application.match_score,
        "applied_at": application.applied_at,
        "notes": application.notes,
        "created_at": application.created_at,
        "updated_at": application.updated_at,
        "job": ApplicationJobSummary(
            id=application.job.id,
            title=application.job.title,
            company_name=application.job.company_name,
            location=application.job.location,
            url=application.job.url
        ) if application.job else None
    }
    return ApplicationRead(**app_dict)

@router.delete("/{app_id}", status_code=204)
async def delete_application(app_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Application).where(Application.id == app_id))
    application = result.scalars().first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    await db.delete(application)
    await db.commit()
    return
