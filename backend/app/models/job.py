from datetime import datetime, timezone
from sqlalchemy import DateTime, Float, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    required_skills: Mapped[list[str]] = mapped_column(
        JSON,
        default=list
    )

    preferred_skills: Mapped[list[str]] = mapped_column(
        JSON,
        default=list
    )

    minimum_experience: Mapped[float] = mapped_column(
        Float,
        default=0.0
    )

    qualifications: Mapped[list[str]] = mapped_column(
        JSON,
        default=list
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
