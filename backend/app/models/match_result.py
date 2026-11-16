from datetime import datetime, timezone
from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class MatchResult(Base):
    __tablename__ = "match_results"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    candidate_id: Mapped[int] = mapped_column(
        ForeignKey("candidates.id"),
        nullable=False,
        index=True,
        unique=True
    )

    overall_score: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    skill_score: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    semantic_score: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    experience_score: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    qualification_score: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    matched_skills: Mapped[list[str]] = mapped_column(
        JSON,
        default=list
    )

    missing_skills: Mapped[list[str]] = mapped_column(
        JSON,
        default=list
    )

    explanation: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
