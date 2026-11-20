# TalentRank - AI-Powered Resume Matching & Candidate Ranking

TalentRank is an AI-powered recruitment platform that helps recruiters evaluate, compare, and rank candidates against job descriptions. It uses semantic similarity, skill matching, and experience evaluation to generate candidate scores and explain why a candidate is a good fit for a role.

The goal is to make resume screening faster, more consistent, and more transparent through AI-assisted candidate evaluation.

## Features

### Job Management

- Create and manage job descriptions.
- Define required and preferred skills.
- Specify minimum experience requirements.
- Add educational qualifications.
- View existing job listings.

### Resume Upload & Parsing

- Upload multiple resumes in a single batch.
- Supports PDF and DOCX formats.
- Extract candidate information, including:
  - Candidate name
  - Email address
  - Total work experience
  - Technical skills
  - Educational qualifications
- Validate uploaded files by format, file signature, and size.
- Handle individual upload failures without stopping the entire batch.

### AI-Powered Resume Matching

- Generate semantic embeddings using Sentence Transformers.
- Compare job descriptions with candidate resume content.
- Evaluate required and preferred skills.
- Calculate experience scores.
- Generate an overall candidate matching score between 0 and 100.
- Provide explanations for candidate evaluations.

### Candidate Ranking Dashboard

- Rank candidates based on their overall matching scores.
- Display individual scoring components.
- Show matched and missing skills.
- Identify top-performing candidates.
- Access detailed candidate profiles.

### Detailed Candidate Profiles

- View candidate information and extracted resume details.
- Review AI-generated matching scores.
- Explore semantic, skill, and experience evaluations.
- See matched and missing skills.
- Review education and professional experience information.

## Technology Stack

| Layer           | Technologies             |
| --------------- | ------------------------ |
| Frontend        | React, TypeScript, Vite  |
| Styling         | Tailwind CSS, Custom CSS |
| Routing         | React Router             |
| Icons           | Lucide React             |
| Backend         | Python, FastAPI          |
| Database        | SQLite                   |
| ORM             | SQLAlchemy               |
| Validation      | Pydantic                 |
| Resume Parsing  | PyMuPDF, python-docx     |
| AI / NLP        | Sentence Transformers    |
| Embedding Model | all-MiniLM-L6-v2         |
| API Testing     | Thunder Client           |
| Version Control | Git, GitHub              |

## AI Matching Methodology

TalentRank combines semantic similarity, skill matching, and experience evaluation to calculate an overall candidate score.

### 1. Semantic Similarity

The system uses the `sentence-transformers/all-MiniLM-L6-v2` model to convert job descriptions and candidate resumes into vector embeddings.

Cosine similarity is used to measure how closely the candidate's resume aligns with the job description.

### 2. Skill Matching

The system identifies required and preferred skills from the job description and compares them against the candidate's extracted skills.

Skill normalization handles common variations and aliases, such as:

- JS → JavaScript
- ReactJS → React
- NodeJS → Node.js
- Postgres → PostgreSQL
- ML → Machine Learning
- Fast API → FastAPI

### 3. Experience Evaluation

Candidate experience is evaluated against the minimum experience specified in the job description.

Candidates meeting the requirement receive full experience credit. Candidates below the requirement receive a proportional score.

### 4. Overall Matching Score

The final score is calculated using the following weighted formula:

\[
Overall = 0.40M + 0.30R + 0.20E + 0.10P
\]

Where:

| Component               | Weight |
| ----------------------- | -----: |
| Semantic Similarity (M) |    40% |
| Required Skills (R)     |    30% |
| Experience (E)          |    20% |
| Preferred Skills (P)    |    10% |

The final score ranges from 0 to 100.

Candidates are ranked in descending order of their overall matching scores.

## Application Architecture

The application follows a frontend-backend architecture.

```text
                    TalentRank
                        |
             +----------+----------+
             |                     |
          Frontend               Backend
             |                     |
       React + TypeScript        FastAPI
             |                     |
       React Router          API Endpoints
                                   |
                          +--------+--------+
                          |        |        |
                       Parsing  Matching  Job Services
                          |        |        |
                          |    Sentence     |
                          |   Transformers  |
                          |        |        |
                          +--------+--------+
                                   |
                              SQLAlchemy
                                   |
                                SQLite
```

## Project Structure

```text
talentrank/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── candidates.py
│   │   │   ├── jobs.py
│   │   │   └── matching.py
│   │   │
│   │   ├── core/
│   │   │   └── database.py
│   │   │
│   │   ├── models/
│   │   │   ├── candidate.py
│   │   │   ├── job.py
│   │   │   └── match_result.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── candidate.py
│   │   │   ├── job.py
│   │   │   └── match.py
│   │   │
│   │   ├── services/
│   │   │   ├── embedding_service.py
│   │   │   ├── jd_parser.py
│   │   │   ├── matching_service.py
│   │   │   ├── resume_extractor.py
│   │   │   ├── resume_parser.py
│   │   │   └── skill_service.py
│   │   │
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── venv/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── AppLayout.tsx
│   │   │
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── Sidebar.tsx
│   │   │       └── Topbar.tsx
│   │   │
│   │   ├── features/
│   │   │   ├── candidates/
│   │   │   │   ├── candidates.api.ts
│   │   │   │   └── candidate.types.ts
│   │   │   │
│   │   │   └── jobs/
│   │   │       ├── job.api.ts
│   │   │       └── job.types.ts
│   │   │
│   │   ├── lib/
│   │   │   └── api.ts
│   │   │
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── JobManagementPage.tsx
│   │   │   ├── ResumeUploadPage.tsx
│   │   │   ├── CandidateRankingPage.tsx
│   │   │   ├── CandidateProfilePage.tsx
│   │   │   └── PlaceholderPage.tsx
│   │   │
│   │   ├── styles/
│   │   │   └── index.css
│   │   │
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 22+
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/talentrank.git
cd talentrank
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI development server:

```bash
python -m uvicorn app.main:app --reload
```

Backend runs at:

`http://127.0.0.1:8000`

Interactive API documentation:

`http://127.0.0.1:8000/docs`

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will be available at the local URL displayed by Vite, typically:

`http://localhost:5173`

## API Endpoints

The following are the main implemented API routes.

### Jobs

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| POST   | `/jobs/`         | Create a job            |
| GET    | `/jobs/`         | Retrieve all jobs       |
| GET    | `/jobs/{job_id}` | Retrieve a specific job |

### Candidates

| Method | Endpoint                                   | Description                   |
| ------ | ------------------------------------------ | ----------------------------- |
| POST   | `/jobs/{job_id}/candidates/upload`         | Upload multiple resumes       |
| GET    | `/jobs/{job_id}/candidates/`               | Retrieve candidates for a job |
| GET    | `/jobs/{job_id}/candidates/{candidate_id}` | Retrieve candidate details    |

### Matching

| Method | Endpoint                                | Description                            |
| ------ | --------------------------------------- | -------------------------------------- |
| POST   | `/jobs/{job_id}/matches/`               | Run AI matching                        |
| GET    | `/jobs/{job_id}/matches/`               | Retrieve ranked matching results       |
| GET    | `/jobs/{job_id}/matches/{candidate_id}` | Retrieve an individual matching result |

## Testing

Backend API endpoints have been tested using Thunder Client.

The application workflow has been tested end to end:

1. Create a job description.
2. Upload candidate resumes.
3. Extract candidate information.
4. Generate semantic embeddings.
5. Run AI-based matching.
6. Calculate candidate scores.
7. Display ranked candidates.
8. Open detailed candidate profiles.
9. Review AI-generated evaluation explanations.

The frontend production build has also been verified.

## Current Development Status

**Completed through Day 5**

| Development Phase                | Status    |
| -------------------------------- | --------- |
| Backend foundation and database  | Completed |
| Resume parsing and extraction    | Completed |
| Semantic embedding generation    | Completed |
| Skill normalization and matching | Completed |
| Job description processing       | Completed |
| Weighted candidate scoring       | Completed |
| Database-integrated matching     | Completed |
| React frontend foundation        | Completed |
| Job management interface         | Completed |
| Resume upload interface          | Completed |
| Candidate ranking dashboard      | Completed |
| Detailed candidate profiles      | Completed |
| End-to-end application workflow  | Tested    |

## Upcoming Improvements

- Comprehensive backend edge-case testing.
- Further validation of matching accuracy and scoring.
- Improved error handling and loading states.
- Responsive UI refinement.
- Final regression testing.
- Project documentation and demo preparation.

## Important Notes

- Use synthetic or publicly licensed resumes for testing.
- The current database configuration uses SQLite.
- The matching score is an AI-assisted ranking signal, not a definitive hiring decision.
- Recruiters should review candidate profiles and supporting information before making hiring decisions.

---

**TalentRank** — Making recruitment smarter through AI-powered resume intelligence.

Built with React, TypeScript, FastAPI, Python, and Sentence Transformers.
