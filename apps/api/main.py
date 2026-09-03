from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.database import engine, async_session_maker
from app.models import Base, User, Job, Resume, Application, Skill
from sqlalchemy import select

from app.routers.jobs import router as jobs_router
from app.routers.resume import router as resume_router
from app.routers.applications import router as applications_router
from app.routers.ai import router as ai_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # On startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with async_session_maker() as session:
        result = await session.execute(select(User).where(User.email == 'local@career-companion.app'))
        user = result.scalars().first()
        if not user:
            new_user = User(
                email='local@career-companion.app',
                full_name='Default User',
                hashed_password='not_used_in_v1'
            )
            session.add(new_user)
            await session.commit()
            
    yield
    # On shutdown
    await engine.dispose()



app = FastAPI(
    title="Career Companion API",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:1420",
        "http://127.0.0.1:1420",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_router)
app.include_router(jobs_router)
app.include_router(applications_router)
app.include_router(ai_router)

@app.get("/")
def root():
    return {
        "message": "Career Companion API is running 🚀"
    }
