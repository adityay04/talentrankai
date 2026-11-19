import re

SKILL_ALIASES = {
    "python": ["python 3", "py"],
    "javascript": ["js", "ecmascript"],
    "typescript": ["ts"],
    "react": ["reactjs", "react.js"],
    "next.js": ["nextjs", "next"],
    "node.js": ["nodejs", "node"],
    "express.js": ["express", "expressjs"],
    "postgresql": ["postgres", "postgre"],
    "mysql": ["my sql"],
    "mongodb": ["mongo"],
    "fastapi": ["fast api"],
    "scikit-learn": ["sklearn", "scikit learn"],
    "machine learning": ["ml"],
    "deep learning": ["dl"],
    "natural language processing": ["nlp"],
    "rest api": ["rest apis", "restful api", "restful apis"],
    "amazon web services": ["aws"],
    "google cloud platform": ["gcp", "google cloud"],
    "microsoft azure": ["azure"],
    "tailwind css": ["tailwind"],
    "c++": ["cpp"],
    "c#": ["c sharp"],
}


DISPLAY_NAMES = {
    "python": "Python",
    "javascript": "JavaScript",
    "typescript": "TypeScript",
    "react": "React",
    "next.js": "Next.js",
    "node.js": "Node.js",
    "express.js": "Express.js",
    "postgresql": "PostgreSQL",
    "mysql": "MySQL",
    "mongodb": "MongoDB",
    "fastapi": "FastAPI",
    "scikit-learn": "Scikit-learn",
    "machine learning": "Machine Learning",
    "deep learning": "Deep Learning",
    "natural language processing": "Natural Language Processing",
    "rest api": "REST API",
    "amazon web services": "AWS",
    "google cloud platform": "Google Cloud Platform",
    "microsoft azure": "Microsoft Azure",
    "tailwind css": "Tailwind CSS",
    "c++": "C++",
    "c#": "C#",
}


def normalize_text(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9+#.\s]", " ", value)
    value = re.sub(r"\s+", " ", value)
    return value


def build_alias_lookup() -> dict[str, str]:
    lookup = {}

    for canonical, aliases in SKILL_ALIASES.items():
        lookup[normalize_text(canonical)] = canonical

        for alias in aliases:
            lookup[normalize_text(alias)] = canonical

    return lookup


ALIAS_LOOKUP = build_alias_lookup()


def normalize_skill(skill: str) -> str:
    normalized = normalize_text(skill)
    canonical = ALIAS_LOOKUP.get(normalized, normalized)

    return DISPLAY_NAMES.get(
        canonical,
        skill.strip()
    )


def normalize_skills(skills: list[str]) -> list[str]:
    normalized = []

    for skill in skills:
        if not skill or not skill.strip():
            continue

        canonical = normalize_skill(skill)

        if canonical.lower() not in {
            existing.lower() for existing in normalized
        }:
            normalized.append(canonical)

    return normalized


def calculate_skill_score(
    candidate_skills: list[str],
    target_skills: list[str]
) -> dict:
    candidate_normalized = normalize_skills(candidate_skills)
    target_normalized = normalize_skills(target_skills)

    candidate_lookup = {
        skill.lower()
        for skill in candidate_normalized
    }

    matched = [
        skill
        for skill in target_normalized
        if skill.lower() in candidate_lookup
    ]

    missing = [
        skill
        for skill in target_normalized
        if skill.lower() not in candidate_lookup
    ]

    if not target_normalized:
        score = 100.0
    else:
        score = (
            len(matched) / len(target_normalized)
        ) * 100

    return {
        "score": round(score, 2),
        "matched_skills": matched,
        "missing_skills": missing
    }


def analyze_candidate_skills(
    candidate_skills: list[str],
    required_skills: list[str],
    preferred_skills: list[str]
) -> dict:
    required_result = calculate_skill_score(
        candidate_skills,
        required_skills
    )

    preferred_result = calculate_skill_score(
        candidate_skills,
        preferred_skills
    )

    matched_skills = normalize_skills(
        required_result["matched_skills"]
        + preferred_result["matched_skills"]
    )

    missing_skills = normalize_skills(
        required_result["missing_skills"]
        + preferred_result["missing_skills"]
    )

    return {
        "required_skill_score": required_result["score"],
        "preferred_skill_score": preferred_result["score"],
        "matched_required_skills": required_result["matched_skills"],
        "missing_required_skills": required_result["missing_skills"],
        "matched_preferred_skills": preferred_result["matched_skills"],
        "missing_preferred_skills": preferred_result["missing_skills"],
        "matched_skills": matched_skills,
        "missing_skills": missing_skills
    }
