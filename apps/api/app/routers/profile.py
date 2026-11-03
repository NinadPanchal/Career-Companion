from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.models.profile import CandidateProfile
from app.models.user import User
from app.models.resume import Resume, ResumeSkill
from app.models.application import Application
from app.models.skill import Skill
from app.schemas.profile import CandidateProfileCreate, CandidateProfileResponse, ATSResult

router = APIRouter(prefix="/profile", tags=["Profile"])

UPLOADS_DIRECTORY = Path(__file__).resolve().parent.parent.parent / "uploads"


async def get_or_create_default_user(db: AsyncSession) -> User:
    result = await db.execute(select(User).order_by(User.id.asc()))
    user = result.scalars().first()
    if not user:
        user = User(
            email='local@career-companion.app',
            full_name='Default User',
            hashed_password='not_used'
        )
        db.add(user)
        await db.flush()
    return user


async def get_or_create_skill(db: AsyncSession, skill_name: str) -> Skill:
    result = await db.execute(select(Skill).where(Skill.name == skill_name))
    skill = result.scalars().first()
    if not skill:
        skill = Skill(name=skill_name)
        db.add(skill)
        await db.flush()
    return skill


@router.get("", response_model=CandidateProfileResponse)
async def get_profile(db: AsyncSession = Depends(get_db)):
    """Retrieve the candidate profile. Returns 404 if no profile has been onboarded."""
    user = await get_or_create_default_user(db)
    
    result = await db.execute(select(CandidateProfile).where(CandidateProfile.user_id == user.id))
    profile = result.scalars().first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No candidate profile found. Onboarding required."
        )

    # Format response
    return CandidateProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        name=profile.name,
        email=profile.email,
        phone=profile.phone,
        location=profile.location,
        headline=profile.headline,
        summary=profile.summary,
        links=profile.links or {},
        skills=profile.skills or [],
        experience=profile.experience or [],
        education=profile.education or [],
        projects=profile.projects or [],
        ats_score=profile.ats_score,
        ats_issues=profile.ats_issues or [],
        resume_id=profile.resume_id,
        resume_filename=profile.resume_filename,
        created_at=profile.created_at,
        updated_at=profile.updated_at,
        ats=ATSResult(
            score=profile.ats_score or 85,
            issues=profile.ats_issues or []
        )
    )


@router.post("", response_model=CandidateProfileResponse)
async def save_profile(
    profile_in: CandidateProfileCreate,
    db: AsyncSession = Depends(get_db)
):
    """Save or update the confirmed candidate profile after onboarding/editing."""
    user = await get_or_create_default_user(db)

    # Sync User table
    if profile_in.name:
        user.full_name = profile_in.name
    if profile_in.email:
        user.email = profile_in.email

    result = await db.execute(select(CandidateProfile).where(CandidateProfile.user_id == user.id))
    profile = result.scalars().first()

    exp_list = [e.model_dump() if hasattr(e, "model_dump") else e for e in profile_in.experience]
    edu_list = [e.model_dump() if hasattr(e, "model_dump") else e for e in profile_in.education]
    proj_list = [p.model_dump() if hasattr(p, "model_dump") else p for p in profile_in.projects]

    if not profile:
        profile = CandidateProfile(
            user_id=user.id,
            name=profile_in.name,
            email=profile_in.email,
            phone=profile_in.phone,
            location=profile_in.location,
            headline=profile_in.headline,
            summary=profile_in.summary,
            links=profile_in.links or {},
            skills=profile_in.skills or [],
            experience=exp_list,
            education=edu_list,
            projects=proj_list,
            ats_score=profile_in.ats_score or 85,
            ats_issues=profile_in.ats_issues or [],
            resume_id=profile_in.resume_id,
            resume_filename=profile_in.resume_filename
        )
        db.add(profile)
    else:
        profile.name = profile_in.name
        profile.email = profile_in.email
        profile.phone = profile_in.phone
        profile.location = profile_in.location
        profile.headline = profile_in.headline
        profile.summary = profile_in.summary
        profile.links = profile_in.links or {}
        profile.skills = profile_in.skills or []
        profile.experience = exp_list
        profile.education = edu_list
        profile.projects = proj_list
        profile.ats_score = profile_in.ats_score or profile.ats_score
        profile.ats_issues = profile_in.ats_issues or profile.ats_issues
        if profile_in.resume_id:
            profile.resume_id = profile_in.resume_id
        if profile_in.resume_filename:
            profile.resume_filename = profile_in.resume_filename

    # Register skills in skills table for discovery matching
    for skill_name in profile_in.skills:
        skill_obj = await get_or_create_skill(db, skill_name)
        if profile_in.resume_id:
            existing_rs = await db.execute(
                select(ResumeSkill).where(
                    ResumeSkill.resume_id == profile_in.resume_id,
                    ResumeSkill.skill_id == skill_obj.id
                )
            )
            if not existing_rs.scalars().first():
                db.add(ResumeSkill(resume_id=profile_in.resume_id, skill_id=skill_obj.id, confidence_score=1.0))

    await db.commit()
    await db.refresh(profile)

    return CandidateProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        name=profile.name,
        email=profile.email,
        phone=profile.phone,
        location=profile.location,
        headline=profile.headline,
        summary=profile.summary,
        links=profile.links or {},
        skills=profile.skills or [],
        experience=profile.experience or [],
        education=profile.education or [],
        projects=profile.projects or [],
        ats_score=profile.ats_score,
        ats_issues=profile.ats_issues or [],
        resume_id=profile.resume_id,
        resume_filename=profile.resume_filename,
        created_at=profile.created_at,
        updated_at=profile.updated_at,
        ats=ATSResult(
            score=profile.ats_score or 85,
            issues=profile.ats_issues or []
        )
    )


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def delete_profile(db: AsyncSession = Depends(get_db)):
    """Reset workspace: deletes candidate profile, applications, and uploaded files."""
    user = await get_or_create_default_user(db)

    # 1. Delete Candidate Profile
    result = await db.execute(select(CandidateProfile).where(CandidateProfile.user_id == user.id))
    profile = result.scalars().first()
    if profile:
        await db.delete(profile)

    # 2. Delete applications
    apps_res = await db.execute(select(Application).where(Application.user_id == user.id))
    for app in apps_res.scalars().all():
        await db.delete(app)

    # 3. Delete resumes and physical files
    resumes_res = await db.execute(select(Resume).where(Resume.user_id == user.id))
    for r in resumes_res.scalars().all():
        if r.stored_filename:
            file_path = UPLOADS_DIRECTORY / r.stored_filename
            file_path.unlink(missing_ok=True)
        await db.delete(r)

    # 4. Clean up any extra users and reset primary user
    other_users = await db.execute(select(User).where(User.id != user.id))
    for ou in other_users.scalars().all():
        await db.delete(ou)
    await db.flush()

    user.full_name = "Candidate"
    user.email = "local@career-companion.app"

    await db.commit()
    return

