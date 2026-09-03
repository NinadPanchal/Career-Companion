from pathlib import Path
from uuid import uuid4
from typing import List

from fastapi import APIRouter, File, HTTPException, UploadFile, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.services.resume_parser import ResumeExtractionError, extract_resume_text
from app.services.resume_sections import detect_resume_sections
from app.services.skill_extractor import extract_skills

from app.core.database import get_db
from app.core.config import settings
from app.models.resume import Resume, ResumeSkill
from app.models.skill import Skill
from app.models.user import User
from app.schemas.resume import ResumeUploadResponse, ResumeRead, ResumeDetail

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

UPLOADS_DIRECTORY = Path(__file__).resolve().parent.parent.parent / "uploads"
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
}

async def get_or_create_default_user(db: AsyncSession) -> User:
    result = await db.execute(select(User).where(User.email == 'local@career-companion.app'))
    user = result.scalars().first()
    if not user:
        user = User(email='local@career-companion.app', full_name='Default User', hashed_password='not_used')
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

@router.get("/", response_model=List[ResumeRead])
async def list_resumes(db: AsyncSession = Depends(get_db)):
    user = await get_or_create_default_user(db)
    result = await db.execute(
        select(Resume).where(Resume.user_id == user.id)
    )
    resumes = result.scalars().all()
    
    # We also need to map skills for ResumeRead
    response_list = []
    for r in resumes:
        await db.refresh(r, ['skills'])
        skill_names = []
        for rs in r.skills:
            await db.refresh(rs, ['skill'])
            skill_names.append(rs.skill.name)
        
        r_dict = {
            "id": r.id,
            "user_id": r.user_id,
            "title": r.title,
            "original_filename": r.original_filename,
            "file_type": r.file_type,
            "file_size_bytes": r.file_size_bytes,
            "word_count": r.word_count or 0,
            "is_primary": r.is_primary,
            "created_at": r.created_at,
            "skills": skill_names
        }
        response_list.append(ResumeRead(**r_dict))

    return response_list

@router.post("/upload", status_code=status.HTTP_201_CREATED, response_model=ResumeUploadResponse)
async def upload_resume(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    """Store one supported resume locally for the next analysis step."""
    extension = ALLOWED_CONTENT_TYPES.get(file.content_type or "")
    if extension is None:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only PDF and DOCX resumes are supported.",
        )

    content = await file.read()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded resume is empty.",
        )
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Resume files must be 10 MB or smaller.",
        )

    UPLOADS_DIRECTORY.mkdir(parents=True, exist_ok=True)
    stored_filename = f"{uuid4()}{extension}"
    destination = UPLOADS_DIRECTORY / stored_filename
    destination.write_bytes(content)

    try:
        extracted_text = extract_resume_text(destination)
    except ResumeExtractionError as error:
        destination.unlink(missing_ok=True)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=str(error),
        ) from error

    sections = detect_resume_sections(extracted_text)
    skills = extract_skills(extracted_text)
    
    user = await get_or_create_default_user(db)
    
    resume = Resume(
        user_id=user.id,
        title=file.filename or "Untitled Resume",
        original_filename=file.filename or "unknown",
        stored_filename=stored_filename,
        file_type=extension.lstrip("."),
        file_size_bytes=len(content),
        raw_text=extracted_text,
        sections=sections,
        word_count=len(extracted_text.split()),
        is_primary=False
    )
    db.add(resume)
    await db.flush()
    
    for skill_name in skills:
        skill_obj = await get_or_create_skill(db, skill_name)
        rs = ResumeSkill(resume_id=resume.id, skill_id=skill_obj.id, confidence_score=1.0)
        db.add(rs)
        
    await db.commit()

    return ResumeUploadResponse(
        message="Resume uploaded and analyzed successfully.",
        original_filename=file.filename or "",
        stored_filename=stored_filename,
        size_bytes=len(content),
        word_count=len(extracted_text.split()),
        text_preview=extracted_text[:500],
        sections=sections,
        skills=skills,
        resume_id=resume.id
    )

@router.get("/{resume_id}", response_model=ResumeDetail)
async def get_resume(resume_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    resume = result.scalars().first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    await db.refresh(resume, ['skills'])
    skill_names = []
    for rs in resume.skills:
        await db.refresh(rs, ['skill'])
        skill_names.append(rs.skill.name)

    r_dict = {
        "id": resume.id,
        "user_id": resume.user_id,
        "title": resume.title,
        "original_filename": resume.original_filename,
        "file_type": resume.file_type,
        "file_size_bytes": resume.file_size_bytes,
        "word_count": resume.word_count or 0,
        "is_primary": resume.is_primary,
        "created_at": resume.created_at,
        "skills": skill_names,
        "raw_text": resume.raw_text,
        "sections": resume.sections
    }
    return ResumeDetail(**r_dict)


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(resume_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    resume = result.scalars().first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    destination = UPLOADS_DIRECTORY / resume.stored_filename
    destination.unlink(missing_ok=True)
    
    await db.delete(resume)
    await db.commit()
    return


@router.patch("/{resume_id}/primary", response_model=ResumeRead)
async def set_primary_resume(resume_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    resume = result.scalars().first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    # unset primary for all user resumes
    user_resumes_res = await db.execute(select(Resume).where(Resume.user_id == resume.user_id))
    for r in user_resumes_res.scalars():
        r.is_primary = False
        
    resume.is_primary = True
    await db.commit()
    await db.refresh(resume)
    
    await db.refresh(resume, ['skills'])
    skill_names = []
    for rs in resume.skills:
        await db.refresh(rs, ['skill'])
        skill_names.append(rs.skill.name)
        
    r_dict = {
        "id": resume.id,
        "user_id": resume.user_id,
        "title": resume.title,
        "original_filename": resume.original_filename,
        "file_type": resume.file_type,
        "file_size_bytes": resume.file_size_bytes,
        "word_count": resume.word_count or 0,
        "is_primary": resume.is_primary,
        "created_at": resume.created_at,
        "skills": skill_names
    }
    return ResumeRead(**r_dict)
