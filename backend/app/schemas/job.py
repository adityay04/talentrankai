from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class JobCreate(BaseModel):
    title: str = Field(min_length=2, max_length=255)
    description: str = Field(min_length=20)
    required_skills: list[str] = Field(default_factory=list)
    preferred_skills: list[str] = Field(default_factory=list)
    minimum_experience: float = Field(default=0.0, ge=0)
    qualifications: list[str] = Field(default_factory=list)

class JobResponse(BaseModel):
    id: int
    title: str
    description: str
    required_skills: list[str]
    preferred_skills: list[str]
    minimum_experience: float
    qualifications: list[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
