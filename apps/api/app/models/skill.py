from typing import Optional, List

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    category: Mapped[Optional[str]] = mapped_column(String(100), index=True)

    # Relationships
    resumes: Mapped[List["ResumeSkill"]] = relationship(back_populates="skill")
    jobs: Mapped[List["JobSkill"]] = relationship(back_populates="skill")
