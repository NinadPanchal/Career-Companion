from datetime import datetime, timedelta
from typing import Sequence, Optional, Dict, Any
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.repositories.base import BaseRepository
from app.models import Application, ApplicationStatus

class ApplicationRepository(BaseRepository[Application]):
    def __init__(self, session: AsyncSession):
        super().__init__(Application, session)

    async def get_by_user(
        self,
        user_id: int,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 50
    ) -> Sequence[Application]:
        stmt = select(Application).where(Application.user_id == user_id)
        
        if status:
            if hasattr(ApplicationStatus, status.upper()):
                stmt = stmt.where(Application.status == getattr(ApplicationStatus, status.upper()))
            else:
                stmt = stmt.where(Application.status == status)
                
        stmt = stmt.options(selectinload(Application.job))
        stmt = stmt.offset(skip).limit(limit)
        
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_stats(self, user_id: int) -> Dict[str, Any]:
        # Count total
        total_stmt = select(func.count()).select_from(Application).where(Application.user_id == user_id)
        total_result = await self.session.execute(total_stmt)
        total = total_result.scalar_one()

        # Count by status
        status_stmt = select(Application.status, func.count()).select_from(Application).where(
            Application.user_id == user_id
        ).group_by(Application.status)
        status_result = await self.session.execute(status_stmt)
        by_status = {status.name if hasattr(status, 'name') else str(status): count for status, count in status_result.all()}

        # Avg match score
        avg_stmt = select(func.avg(Application.match_score)).where(Application.user_id == user_id)
        avg_result = await self.session.execute(avg_stmt)
        avg_match_score = avg_result.scalar_one_or_none()

        # Applied this week/month
        now = datetime.utcnow()
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)
        
        applied_status = getattr(ApplicationStatus, 'APPLIED', 'APPLIED')

        week_stmt = select(func.count()).select_from(Application).where(
            Application.user_id == user_id,
            Application.status == applied_status,
            Application.applied_at >= week_ago
        )
        week_result = await self.session.execute(week_stmt)
        applied_this_week = week_result.scalar_one()

        month_stmt = select(func.count()).select_from(Application).where(
            Application.user_id == user_id,
            Application.status == applied_status,
            Application.applied_at >= month_ago
        )
        month_result = await self.session.execute(month_stmt)
        applied_this_month = month_result.scalar_one()

        return {
            "total": total,
            "by_status": by_status,
            "avg_match_score": float(avg_match_score) if avg_match_score is not None else None,
            "applied_this_week": applied_this_week,
            "applied_this_month": applied_this_month
        }

    async def update_status(self, id: int, new_status: str) -> Optional[Application]:
        obj = await self.get_by_id(id)
        if obj:
            if hasattr(ApplicationStatus, new_status.upper()):
                obj.status = getattr(ApplicationStatus, new_status.upper())
            else:
                obj.status = new_status
            
            if new_status.upper() == 'APPLIED' and obj.applied_at is None:
                obj.applied_at = datetime.utcnow()
                
            await self.session.commit()
            await self.session.refresh(obj)
        return obj
