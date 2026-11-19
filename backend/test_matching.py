from types import SimpleNamespace
from app.services.matching_service import match_candidates


job = SimpleNamespace(
    id=1,
    title="Backend Developer",
    description=(
        "Looking for a backend developer experienced in "
        "Python, FastAPI, PostgreSQL, REST APIs, and Docker. "
        "AWS knowledge is preferred."
    ),
    required_skills=[
        "Python",
        "FastAPI",
        "PostgreSQL"
    ],
    preferred_skills=[
        "Docker",
        "AWS"
    ],
    minimum_experience=2.0
)


candidates = [
    SimpleNamespace(
        id=1,
        name="Aarav Sharma",
        email="aarav@example.com",
        total_experience=3.0,
        extracted_skills=[
            "Python",
            "FastAPI",
            "PostgreSQL",
            "Docker",
            "AWS"
        ],
        resume_text=(
            "Backend developer with 3 years of experience "
            "building REST APIs using Python and FastAPI. "
            "Worked with PostgreSQL, Docker, AWS, and "
            "scalable backend services."
        )
    ),
    SimpleNamespace(
        id=2,
        name="Riya Verma",
        email="riya@example.com",
        total_experience=1.0,
        extracted_skills=[
            "JavaScript",
            "React",
            "HTML",
            "CSS"
        ],
        resume_text=(
            "Frontend developer experienced in building "
            "responsive user interfaces using React, "
            "JavaScript, HTML, and CSS."
        )
    )
]


results = match_candidates(job, candidates)


for candidate in results:
    print("\n" + "=" * 50)
    print(f"Rank: {candidate['rank']}")
    print(f"Candidate: {candidate['candidate_name']}")
    print(f"Overall Score: {candidate['overall_score']}")
    print(f"Semantic Score: {candidate['semantic_score']}")
    print(f"Required Skill Score: {candidate['required_skill_score']}")
    print(f"Experience Score: {candidate['experience_score']}")
    print(f"Preferred Skill Score: {candidate['preferred_skill_score']}")
    print(f"Matched Skills: {candidate['matched_skills']}")
    print(f"Missing Skills: {candidate['missing_skills']}")
    print(f"Explanation: {candidate['explanation']}")


assert len(results) == 2
assert results[0]["overall_score"] >= results[1]["overall_score"]
assert all(
    0 <= candidate["overall_score"] <= 100
    for candidate in results
)

print("\nAll matching tests passed.")
