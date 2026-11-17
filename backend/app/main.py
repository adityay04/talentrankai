from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.config import settings
from app.core.database import Base, engine
from app.api.jobs import router as jobs_router
from app.api.candidates import router as candidates_router
from app import models

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered resume matching and candidate ranking system",
    lifespan=lifespan
)

app.include_router(jobs_router)
app.include_router(candidates_router)


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "application": settings.app_name,
        "version": settings.app_version
    }
