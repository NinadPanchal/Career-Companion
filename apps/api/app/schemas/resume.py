from datetime import datetime
from typing import Optional, Dict, List
from pydantic import BaseModel, ConfigDict, computed_field

class ResumeUploadResponse(BaseModel):
    message: str
    original_filename: str
    stored_filename: str
    size_bytes: int
    word_count: int
    text_preview: str
    sections: Dict[str, str]
    skills: List[str]
    resume_id: int
    
    model_config = ConfigDict(from_attributes=True)

class ResumeRead(BaseModel):
    id: int
    user_id: int
    title: str
    original_filename: str
    file_type: str
    file_size_bytes: int
    word_count: int
    is_primary: bool
    created_at: datetime
    skills: List[str]

    model_config = ConfigDict(from_attributes=True)

class ResumeDetail(ResumeRead):
    raw_text: Optional[str] = None
    sections: Optional[Dict[str, str]] = None

    @computed_field
    def text_preview(self) -> str:
        if self.raw_text:
            return self.raw_text[:500]
        return ""

    model_config = ConfigDict(from_attributes=True)
