from datetime import datetime
from pydantic import BaseModel, ConfigDict

class CandidateResponse(BaseModel):
    id: int
    job_id: int
    source_filename: str
    name: str
    email: str | None
    total_experience: float
    extracted_skills: list[str]
    education: list[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CandidateUploadItem(BaseModel):
    filename: str
    status: str
    candidate_id: int | None = None
    name: str | None = None
    email: str | None = None
    total_experience: float | None = None
    extracted_text_length: int | None = None
    error: str | None = None


class BatchUploadResponse(BaseModel):
    job_id: int
    total_files: int
    successful_uploads: int
    failed_uploads: int
    results: list[CandidateUploadItem]
