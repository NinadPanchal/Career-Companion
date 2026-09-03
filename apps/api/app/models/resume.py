from datetime import datetime
from typing import Optional, List

from sqlalchemy import ForeignKey, String, Integer, Float, Text, Boolean, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.core.database import Base


class ResumeSkill(Base):
    __tablename__ = "resume_skills"

    resume_id: Mapped[int] = mapped_column(ForeignKey("resumes.id", ondelete="CASCADE"), primary_key=True)
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True)
    confidence_score: Mapped[Optional[float]] = mapped_column(Float)

    # Relationships
    resume: Mapped["Resume"] = relationship(back_populates="skills")
    skill: Mapped["Skill"] = relationship(back_populates="resumes")


class Resume(Base):
    __tablename__ = "resumes"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    
    title: Mapped[str] = mapped_column(String(255))
    original_filename: Mapped[str] = mapped_column(String(255))
    stored_filename: Mapped[str] = mapped_column(String(255))
    file_type: Mapped[str] = mapped_column(String(10))
    file_size_bytes: Mapped[int] = mapped_column(Integer)
    
    raw_text: Mapped[Optional[str]] = mapped_column(Text)
    sections: Mapped[Optional[dict]] = mapped_column(JSON)
    word_count: Mapped[Optional[int]] = mapped_column(Integer)
    
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    user: Mapped["User"] = relationship(back_populates="resumes")
    applications: Mapped[List["Application"]] = relationship(back_populates="resume")
    skills: Mapped[List["ResumeSkill"]] = relationship(back_populates="resume", cascade="all, delete-orphan")
