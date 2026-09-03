from typing import Sequence, Optional
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.models import Job

class JobRepository(BaseRepository[Job]):
    def __init__(self, session: AsyncSession):
        super().__init__(Job, session)

    async def search(
        self,
        query: Optional[str] = None,
        location: Optional[str] = None,
        remote_only: bool = False,
        skip: int = 0,
        limit: int = 20
    ) -> Sequence[Job]:
        stmt = select(Job)
        
        if query:
            search_filter = or_(
                Job.title.ilike(f"%{query}%"),
                Job.company_name.ilike(f"%{query}%"),
                Job.description.ilike(f"%{query}%")
            )
            stmt = stmt.where(search_filter)
            
        if location:
            stmt = stmt.where(Job.location.ilike(f"%{location}%"))
            
        if remote_only:
            stmt = stmt.where(Job.is_remote == True)
            
        stmt = stmt.offset(skip).limit(limit)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def find_by_external_id(self, external_id: str, source: str) -> Optional[Job]:
        if not hasattr(Job, 'external_id'):
            return None # Fallback if model missing field
        stmt = select(Job).where(
            Job.external_id == external_id,
            Job.source == source
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def upsert_from_api(self, job_data: dict) -> Job:
        external_id = job_data.get("external_id")
        source = job_data.get("source")
        
        if external_id and source:
            existing = await self.find_by_external_id(external_id, source)
            if existing:
                for key, value in job_data.items():
                    setattr(existing, key, value)
                await self.session.commit()
                await self.session.refresh(existing)
                return existing
                
        return await self.create(**job_data)
