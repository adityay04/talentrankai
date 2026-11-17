import re

SKILL_DICTIONARY = [
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "C++",
    "C#",
    "React",
    "Next.js",
    "Node.js",
    "Express.js",
    "FastAPI",
    "Django",
    "Flask",
    "SQL",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "Git",
    "GitHub",
    "Machine Learning",
    "Deep Learning",
    "Natural Language Processing",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "REST API",
    "HTML",
    "CSS",
    "Tailwind CSS"
]


EDUCATION_KEYWORDS = [
    "B.Tech",
    "B.E.",
    "B.Sc",
    "BCA",
    "MCA",
    "M.Tech",
    "M.E.",
    "M.Sc",
    "Bachelor",
    "Master",
    "Ph.D",
    "Diploma"
]


def extract_email(text: str) -> str | None:
    match = re.search(
        r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
        text
    )

    return match.group(0) if match else None


def extract_name(text: str) -> str:
    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    excluded_labels = {
        "resume",
        "curriculum vitae",
        "cv",
        "profile",
        "professional summary",
        "contact"
    }

    for line in lines[:15]:
        normalized = line.lower().strip(" :|-")

        if normalized in excluded_labels:
            continue

        if "@" in line or re.search(r"\d", line):
            continue

        words = line.split()

        if 2 <= len(words) <= 5 and len(line) <= 80:
            if all(
                re.fullmatch(r"[A-Za-z][A-Za-z.'-]*", word)
                for word in words
            ):
                return line

    return "Unknown"


def extract_experience(text: str) -> float:
    patterns = [
        r"(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)\b"
    ]

    experience_values = []

    for pattern in patterns:
        matches = re.findall(
            pattern,
            text,
            re.IGNORECASE
        )

        experience_values.extend(
            float(value) for value in matches
        )

    return max(experience_values, default=0.0)


def extract_skills(text: str) -> list[str]:
    found_skills = []

    normalized_text = text.lower()

    for skill in SKILL_DICTIONARY:
        pattern = (
            r"(?<![a-z0-9+#])"
            + re.escape(skill.lower())
            + r"(?![a-z0-9+#])"
        )

        if re.search(pattern, normalized_text):
            found_skills.append(skill)

    return found_skills


def extract_education(text: str) -> list[str]:
    education = []

    for line in text.splitlines():
        normalized_line = line.strip()

        if any(
            keyword.lower() in normalized_line.lower()
            for keyword in EDUCATION_KEYWORDS
        ):
            if normalized_line not in education:
                education.append(normalized_line)

    return education


def extract_candidate_details(text: str) -> dict:
    return {
        "name": extract_name(text),
        "email": extract_email(text),
        "total_experience": extract_experience(text),
        "extracted_skills": extract_skills(text),
        "education": extract_education(text)
    }
