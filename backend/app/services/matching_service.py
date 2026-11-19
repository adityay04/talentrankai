from app.services.embedding_service import (
    calculate_similarity,
    generate_embeddings
)
from app.services.skill_service import analyze_candidate_skills

SEMANTIC_WEIGHT = 0.40
REQUIRED_SKILL_WEIGHT = 0.30
EXPERIENCE_WEIGHT = 0.20
PREFERRED_SKILL_WEIGHT = 0.10


def calculate_experience_score(
    candidate_experience: float,
    minimum_experience: float
) -> float:
    if minimum_experience <= 0:
        return 100.0

    if candidate_experience >= minimum_experience:
        return 100.0

    score = (
        candidate_experience / minimum_experience
    ) * 100

    return round(max(0.0, min(100.0, score)), 2)


def calculate_overall_score(
    semantic_score: float,
    required_skill_score: float,
    experience_score: float,
    preferred_skill_score: float
) -> float:
    score = (
        semantic_score * SEMANTIC_WEIGHT
        + required_skill_score * REQUIRED_SKILL_WEIGHT
        + experience_score * EXPERIENCE_WEIGHT
        + preferred_skill_score * PREFERRED_SKILL_WEIGHT
    )

    return round(
        max(0.0, min(100.0, score)),
        2
    )


def generate_match_explanation(
    candidate_name: str,
    semantic_score: float,
    required_skill_score: float,
    experience_score: float,
    preferred_skill_score: float,
    matched_required_skills: list[str],
    missing_required_skills: list[str],
    matched_preferred_skills: list[str],
    missing_preferred_skills: list[str],
    candidate_experience: float,
    minimum_experience: float
) -> str:
    explanation = [
        f"{candidate_name} received a semantic relevance score of {semantic_score:.2f}/100.",
        f"Required skills match: {required_skill_score:.2f}/100.",
        f"Experience match: {experience_score:.2f}/100.",
        f"Preferred skills match: {preferred_skill_score:.2f}/100."
    ]

    if matched_required_skills:
        explanation.append(
            "Matched required skills: "
            + ", ".join(matched_required_skills)
            + "."
        )

    if missing_required_skills:
        explanation.append(
            "Missing required skills: "
            + ", ".join(missing_required_skills)
            + "."
        )

    if matched_preferred_skills:
        explanation.append(
            "Matched preferred skills: "
            + ", ".join(matched_preferred_skills)
            + "."
        )

    if missing_preferred_skills:
        explanation.append(
            "Missing preferred skills: "
            + ", ".join(missing_preferred_skills)
            + "."
        )

    explanation.append(
        f"Candidate experience: {candidate_experience:.1f} years."
    )

    if minimum_experience > 0:
        explanation.append(
            f"Minimum required experience: {minimum_experience:.1f} years."
        )

    return " ".join(explanation)


def match_candidates(job, candidates: list) -> list[dict]:
    if not candidates:
        return []

    if not job.description or not job.description.strip():
        raise ValueError("Job description cannot be empty")

    texts = [job.description]

    for candidate in candidates:
        if not candidate.resume_text or not candidate.resume_text.strip():
            raise ValueError(
                f"Candidate {candidate.id} has no resume text"
            )

        texts.append(candidate.resume_text)

    embeddings = generate_embeddings(texts)

    results = []

    for index, candidate in enumerate(candidates, start=1):
        semantic_score = calculate_similarity(
            embeddings[0],
            embeddings[index]
        )

        skill_analysis = analyze_candidate_skills(
            candidate_skills=candidate.extracted_skills or [],
            required_skills=job.required_skills or [],
            preferred_skills=job.preferred_skills or []
        )

        experience_score = calculate_experience_score(
            candidate_experience=candidate.total_experience or 0.0,
            minimum_experience=job.minimum_experience or 0.0
        )

        required_skill_score = skill_analysis[
            "required_skill_score"
        ]

        preferred_skill_score = skill_analysis[
            "preferred_skill_score"
        ]

        overall_score = calculate_overall_score(
            semantic_score=semantic_score,
            required_skill_score=required_skill_score,
            experience_score=experience_score,
            preferred_skill_score=preferred_skill_score
        )

        explanation = generate_match_explanation(
            candidate_name=candidate.name,
            semantic_score=semantic_score,
            required_skill_score=required_skill_score,
            experience_score=experience_score,
            preferred_skill_score=preferred_skill_score,
            matched_required_skills=skill_analysis[
                "matched_required_skills"
            ],
            missing_required_skills=skill_analysis[
                "missing_required_skills"
            ],
            matched_preferred_skills=skill_analysis[
                "matched_preferred_skills"
            ],
            missing_preferred_skills=skill_analysis[
                "missing_preferred_skills"
            ],
            candidate_experience=candidate.total_experience or 0.0,
            minimum_experience=job.minimum_experience or 0.0
        )

        results.append({
            "candidate_id": candidate.id,
            "candidate_name": candidate.name,
            "email": candidate.email,
            "overall_score": overall_score,
            "semantic_score": semantic_score,
            "required_skill_score": required_skill_score,
            "experience_score": experience_score,
            "preferred_skill_score": preferred_skill_score,
            "matched_required_skills": skill_analysis[
                "matched_required_skills"
            ],
            "missing_required_skills": skill_analysis[
                "missing_required_skills"
            ],
            "matched_preferred_skills": skill_analysis[
                "matched_preferred_skills"
            ],
            "missing_preferred_skills": skill_analysis[
                "missing_preferred_skills"
            ],
            "matched_skills": skill_analysis["matched_skills"],
            "missing_skills": skill_analysis["missing_skills"],
            "explanation": explanation
        })

    results.sort(
        key=lambda result: result["overall_score"],
        reverse=True
    )

    for rank, result in enumerate(results, start=1):
        result["rank"] = rank

    return results
