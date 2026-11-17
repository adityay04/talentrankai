from pathlib import Path
from docx import Document

OUTPUT_DIR = Path(__file__).parent / "resumes"

CANDIDATES = [
    {
        "name": "Rahul Sharma",
        "email": "rahul@example.com",
        "experience": "3 years",
        "education": "B.Tech in Computer Science",
        "summary": "Python backend developer experienced in building REST APIs.",
        "skills": "Python, FastAPI, SQL, PostgreSQL, Docker, Git"
    },
    {
        "name": "Priya Verma",
        "email": "priya@example.com",
        "experience": "4 years",
        "education": "B.Tech in Information Technology",
        "summary": "Backend engineer developing scalable services using Python and Django.",
        "skills": "Python, Django, PostgreSQL, AWS, Docker, Redis"
    },
    {
        "name": "Aman Gupta",
        "email": "aman@example.com",
        "experience": "2 years",
        "education": "BCA",
        "summary": "Software developer focused on frontend and backend web applications.",
        "skills": "JavaScript, React, Node.js, Express.js, MongoDB, Git"
    },
    {
        "name": "Sneha Patel",
        "email": "sneha@example.com",
        "experience": "5 years",
        "education": "M.Tech in Computer Science",
        "summary": "Experienced Python developer building machine learning applications.",
        "skills": "Python, Machine Learning, TensorFlow, SQL, AWS"
    },
    {
        "name": "Arjun Singh",
        "email": "arjun@example.com",
        "experience": "3 years",
        "education": "B.Tech in Computer Science",
        "summary": "Backend developer creating REST API services and database systems.",
        "skills": "Python, Flask, FastAPI, MySQL, Docker, Git"
    },
    {
        "name": "Neha Kapoor",
        "email": "neha@example.com",
        "experience": "1 year",
        "education": "B.Sc Computer Science",
        "summary": "Junior developer interested in backend development and cloud computing.",
        "skills": "Python, SQL, Git, AWS"
    },
    {
        "name": "Vikram Rao",
        "email": "vikram@example.com",
        "experience": "6 years",
        "education": "B.Tech in Information Technology",
        "summary": "Senior backend engineer designing distributed applications.",
        "skills": "Java, Spring Boot, PostgreSQL, Redis, Docker, Kubernetes"
    },
    {
        "name": "Ananya Mehta",
        "email": "ananya@example.com",
        "experience": "2 years",
        "education": "MCA",
        "summary": "Python developer working on data processing and backend systems.",
        "skills": "Python, Django, SQL, Pandas, Git"
    },
    {
        "name": "Karan Malhotra",
        "email": "karan@example.com",
        "experience": "4 years",
        "education": "B.Tech in Computer Science",
        "summary": "Full stack developer building modern web applications.",
        "skills": "React, Next.js, TypeScript, Node.js, MongoDB, Docker"
    },
    {
        "name": "Isha Reddy",
        "email": "isha@example.com",
        "experience": "3 years",
        "education": "B.Tech in Computer Science",
        "summary": "Backend engineer experienced in APIs and cloud infrastructure.",
        "skills": "Python, FastAPI, REST API, PostgreSQL, Docker, AWS"
    }
]


def generate_resume(candidate: dict):
    document = Document()

    document.add_heading(candidate["name"], level=0)

    document.add_paragraph(candidate["email"])

    document.add_heading("Professional Summary", level=1)
    document.add_paragraph(candidate["summary"])

    document.add_heading("Experience", level=1)
    document.add_paragraph(
        f"Total professional experience: {candidate['experience']}"
    )

    document.add_heading("Education", level=1)
    document.add_paragraph(candidate["education"])

    document.add_heading("Technical Skills", level=1)
    document.add_paragraph(candidate["skills"])

    filename = (
        candidate["name"].lower().replace(" ", "_") + ".docx"
    )

    document.save(OUTPUT_DIR / filename)


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for candidate in CANDIDATES:
        generate_resume(candidate)

    print(f"Generated {len(CANDIDATES)} synthetic resumes.")
    print(f"Location: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
