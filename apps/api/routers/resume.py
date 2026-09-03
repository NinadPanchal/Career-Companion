from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile, status
from services.resume_parser import ResumeExtractionError, extract_resume_text
from services.resume_sections import detect_resume_sections
from services.skill_extractor import extract_skills

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

UPLOADS_DIRECTORY = Path(__file__).resolve().parent.parent / "uploads"
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
}

@router.get("/")
def get_resume():
    return {
        "message": "Resume router is working!"
    }


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_resume(file: UploadFile = File(...)):
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

    return {
        "message": "Resume uploaded and analyzed successfully.",
        "original_filename": file.filename,
        "stored_filename": stored_filename,
        "size_bytes": len(content),
        "word_count": len(extracted_text.split()),
        "text_preview": extracted_text[:500],
        "sections": sections,
        "skills": skills,
    }
