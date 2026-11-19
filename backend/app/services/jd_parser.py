import re

from app.services.resume_extractor import (
    EDUCATION_KEYWORDS,
    extract_skills
)


EXPERIENCE_PATTERNS = [
    r"(?:minimum|min\.?|at least)\s*(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)",
    r"(\d+(?:\.\d+)?)\s*\+\s*(?:years?|yrs?)",
    r"(\d+(?:\.\d+)?)\s*(?:-|to)\s*\d+(?:\.\d+)?\s*(?:years?|yrs?)",
    r"(\d+(?:\.\d+)?)\s*(?:years?|yrs?)"
]


def extract_minimum_experience(description: str) -> float:
    if not description or not description.strip():
        return 0.0

    normalized_description = description.lower()

    for pattern in EXPERIENCE_PATTERNS:
        match = re.search(
            pattern,
            normalized_description,
            re.IGNORECASE
        )

        if match:
            return float(match.group(1))

    return 0.0


def extract_qualifications(description: str) -> list[str]:
    if not description or not description.strip():
        return []

    qualifications = []

    for line in description.splitlines():
        normalized_line = line.strip()

        if not normalized_line:
            continue

        if any(
            keyword.lower() in normalized_line.lower()
            for keyword in EDUCATION_KEYWORDS
        ):
            if normalized_line not in qualifications:
                qualifications.append(normalized_line)

    return qualifications


def parse_job_description(description: str) -> dict:
    if not description or not description.strip():
        raise ValueError("Job description cannot be empty")

    return {
        "mentioned_skills": extract_skills(description),
        "minimum_experience": extract_minimum_experience(description),
        "qualifications": extract_qualifications(description)
    }
