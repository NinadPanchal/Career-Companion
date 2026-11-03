from datetime import datetime
from typing import Optional, List, Dict, Any

from sqlalchemy import ForeignKey, String, Integer, Text, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.core.database import Base


class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True)
    resume_id: Mapped[Optional[int]] = mapped_column(ForeignKey("resumes.id", ondelete="SET NULL"), nullable=True)

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    headline: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    links: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, default=dict)
    skills: Mapped[List[str]] = mapped_column(JSON, default=list)
    experience: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    education: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    projects: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)

    ats_score: Mapped[Optional[int]] = mapped_column(Integer, default=85)
    ats_issues: Mapped[Optional[List[str]]] = mapped_column(JSON, default=list)

    resume_filename: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    user: Mapped["User"] = relationship(back_populates="profile")
    resume: Mapped[Optional["Resume"]] = relationship()

