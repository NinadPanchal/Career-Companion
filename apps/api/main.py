from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.resume import router as resume_router


app = FastAPI(
    title="Career Companion API",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:1420", "http://127.0.0.1:1420"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_router)

@app.get("/")
def root():
    return {
        "message": "Career Companion API is running 🚀"
    }
