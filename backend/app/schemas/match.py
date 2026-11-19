
from datetime import datetime

from pydantic import BaseModel


class MatchResponse(BaseModel):
    rank: int
    candidate_id: int
    candidate_name: str
    email: str | None
    overall_score: float
    semantic_score: float
    required_skill_score: float
    experience_score: float
    preferred_skill_score: float
    matched_skills: list[str]
    missing_skills: list[str]
    explanation: str
    created_at: datetime
