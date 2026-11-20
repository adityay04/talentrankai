
import re
from datetime import date


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


MONTH_PATTERN = (
    r"(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|"
    r"Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|"
    r"Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)"
)

DATE_PATTERN = (
    rf"(?:{MONTH_PATTERN}\s+\d{{4}}|\d{{1,2}}[/-]\d{{4}})"
)

DATE_RANGE_PATTERN = re.compile(
    rf"(?P<start>{DATE_PATTERN})\s*"
    rf"(?:-|–|—|to)\s*"
    rf"(?P<end>Present|Current|{DATE_PATTERN})",
    re.IGNORECASE
)

MONTH_NUMBERS = {
    "jan": 1,
    "feb": 2,
    "mar": 3,
    "apr": 4,
    "may": 5,
    "jun": 6,
    "jul": 7,
    "aug": 8,
    "sep": 9,
    "oct": 10,
    "nov": 11,
    "dec": 12
}

EXPERIENCE_HEADINGS = {
    "experience",
    "work experience",
    "professional experience",
    "employment",
    "employment history"
}

OTHER_SECTION_HEADINGS = {
    "education",
    "projects",
    "technical skills",
    "skills",
    "positions of responsibility",
    "certifications",
    "achievements",
    "awards",
    "interests",
    "publications",
    "leadership",
    "volunteering"
}


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


def parse_date_value(value: str) -> int | None:
    normalized = value.strip().lower()

    numeric_match = re.fullmatch(
        r"(\d{1,2})[/-](\d{4})",
        normalized
    )

    if numeric_match:
        month = int(numeric_match.group(1))
        year = int(numeric_match.group(2))

        if 1 <= month <= 12:
            return year * 12 + month - 1

        return None

    month_match = re.fullmatch(
        rf"({MONTH_PATTERN})\s+(\d{{4}})",
        normalized,
        re.IGNORECASE
    )

    if not month_match:
        return None

    month_name = month_match.group(1)[:3].lower()
    year = int(month_match.group(2))
    month = MONTH_NUMBERS[month_name]

    return year * 12 + month - 1


def extract_experience_date_ranges(text: str) -> list[tuple[int, int]]:
    intervals = []
    inside_experience_section = False

    current_month = (
        date.today().year * 12
        + date.today().month - 1
    )

    for line in text.splitlines():
        normalized_heading = line.strip().lower().strip(" :|-")

        if normalized_heading in EXPERIENCE_HEADINGS:
            inside_experience_section = True
            continue

        if normalized_heading in OTHER_SECTION_HEADINGS:
            inside_experience_section = False
            continue

        if not inside_experience_section:
            continue

        for match in DATE_RANGE_PATTERN.finditer(line):
            start = parse_date_value(match.group("start"))

            end_text = match.group("end")

            if end_text.lower() in {"present", "current"}:
                end = current_month
            else:
                end = parse_date_value(end_text)

            if start is None or end is None:
                continue

            if end > start:
                intervals.append((start, end))

    return intervals


def calculate_total_experience(intervals: list[tuple[int, int]]) -> float:
    if not intervals:
        return 0.0

    intervals.sort()

    merged_intervals = []

    current_start, current_end = intervals[0]

    for start, end in intervals[1:]:
        if start <= current_end:
            current_end = max(current_end, end)
        else:
            merged_intervals.append(
                (current_start, current_end)
            )

            current_start, current_end = start, end

    merged_intervals.append(
        (current_start, current_end)
    )

    total_months = sum(
        end - start
        for start, end in merged_intervals
    )

    return round(total_months / 12, 2)


def extract_experience(text: str) -> float:
    explicit_matches = re.findall(
        r"(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)\b",
        text,
        re.IGNORECASE
    )

    explicit_experience = max(
        (float(value) for value in explicit_matches),
        default=0.0
    )

    intervals = extract_experience_date_ranges(text)

    date_range_experience = calculate_total_experience(
        intervals
    )

    return max(
        explicit_experience,
        date_range_experience
    )


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
