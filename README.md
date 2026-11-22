TalentRank - AI-Powered Resume Matching & Candidate Ranking
TalentRank is a full-stack recruitment application that helps recruiters evaluate, compare, and rank candidates against a job description. It combines resume parsing, semantic similarity, skill matching, and experience evaluation to produce a score from 0–100 with supporting explanations.

The goal is to make resume screening faster, more consistent, and more transparent. TalentRank is an AI-assisted decision-support tool; it does not make hiring decisions automatically.
Features
Job Management

- Create and manage job descriptions.
- Define required and preferred skills.
- Specify minimum experience.
- Add educational qualifications.
- View existing jobs.
  Resume Upload and Parsing
- Upload multiple resumes in one batch.
- Supports PDF and DOCX.
- Extract candidate name, email, work experience, skills, and education when available in the document.
- Validate file type, file signature, and file size.
- Continue processing a batch when an individual file fails.
  AI-Powered Matching
- Generate text embeddings with Sentence Transformers.
- Compare job requirements with resume content using semantic similarity.
- Evaluate required and preferred skills.
- Evaluate candidate experience against the job's minimum experience.
- Calculate an overall score from 0–100.
- Provide a score breakdown and evaluation explanation.
  Candidate Ranking and Profiles
- Rank candidates by overall score.
- Display score components.
- Show matched and missing skills.
- Compare candidate experience with the job requirement.
- Open detailed candidate profiles.
  Technology Stack
  Layer Technology
  Frontend React, TypeScript, Vite
  Styling Tailwind CSS, custom CSS
  Routing React Router
  Icons Lucide React
  Backend Python, FastAPI
  Database SQLite
  ORM SQLAlchemy
  Validation Pydantic
  Resume parsing PyMuPDF, python-docx
  Embeddings Sentence Transformers
  Embedding model sentence-transformers/all-MiniLM-L6-v2
  API testing Thunder Client
  Version control Git, GitHub

How the Matching System Works
TalentRank evaluates each candidate using four components. Each component is represented on a 0–100 scale.

1. Resume and Job Description Processing
   The recruiter creates a job and supplies its description, required skills, preferred skills, minimum experience, and qualifications.

When resumes are uploaded, the backend:

1. Validates the uploaded file.
2. Extracts text from PDF or DOCX.
3. Parses candidate details such as skills, education, and experience.
4. Stores candidate information in the database.
   The quality of extracted information depends on the structure and readability of the resume. Missing or unusual formatting can affect extraction.
5. Semantic Similarity (M)
   TalentRank uses sentence-transformers/all-MiniLM-L6-v2 to encode the job description and resume text as numerical vector embeddings.

Cosine similarity measures the direction-based similarity between the two vectors. The similarity is converted to a 0–100 semantic score.

This component can recognize related wording and concepts, rather than relying only on exact keyword matches. It is not a guarantee that a candidate is qualified. 3. Required Skills (R)
The system compares the job's required skills with the candidate's extracted skills.

Skill normalization maps common aliases and variations to a consistent form. Examples include:

- JS → JavaScript
- ReactJS → React
- NodeJS → Node.js
- Postgres → PostgreSQL
- ML → Machine Learning
- Fast API → FastAPI
  The required-skill score reflects the proportion of required skills found in the candidate's normalized skill set. If no required skills are specified, the component is handled so that it does not penalize the candidate for an empty requirement.

4. Experience (E)
   The candidate's parsed total experience is compared with the job's minimum experience.

- A candidate who meets or exceeds the minimum receives full experience credit.
- A candidate below the minimum receives proportional credit based on the experience available.
- When the job specifies zero minimum experience, the experience component does not penalize the candidate.
  Experience extracted from resumes is an estimate and should be reviewed when dates or employment history are ambiguous.

5. Preferred Skills (P)
   Preferred skills are compared with the candidate's normalized extracted skills. The score reflects the proportion of preferred skills found.

Preferred skills contribute to the score, but they carry less weight than required skills. 6. Overall Score and Ranking
The overall score is a weighted sum:
Overall Score = 0.40M + 0.30R + 0.20E + 0.10P
Component Symbol Weight
Semantic similarity M 40%
Required skills R 30%
Experience E 20%
Preferred skills P 10%

Because every component is on a 0 - 100 scale and the weights sum to 1.00, the overall score is also on a 0–100 scale.

Candidates are sorted in descending order of overall score. The ranking is intended to support recruiter review, not replace human judgment.

1. Clone the Repository
   git clone https://github.com/adityay04/talentrank.git
   cd talentrank
2. Set Up the Backend
   Open a terminal in the project root:
   cd backend
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   Start the backend:
   python -m uvicorn app.main:app --reload
   The API runs at:

- API: http://127.0.0.1:8000
- Interactive API documentation: http://127.0.0.1:8000/docs
  Keep this terminal running.

If PowerShell blocks virtual-environment activation, run the following in the current terminal and then activate the environment again:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\venv\Scripts\Activate.ps1 3. Set Up the Frontend
Open a second terminal from the project root:
cd frontend
npm install
npm run dev
Open the local URL printed by Vite, typically:

http://localhost:5173

Keep the frontend terminal running as well. 4. First Run Notes

- The SQLite database is created/configured by the backend application.
- The Sentence Transformers model may be downloaded the first time the embedding service is initialized. This requires an internet connection and may take a few minutes.
- Resume files are processed by the backend. Use test resumes that you have permission to use.
  API Endpoints
  Jobs
  Method Endpoint Description
  POST /jobs/ Create a job
  GET /jobs/ Retrieve all jobs
  GET /jobs/{job_id} Retrieve a specific job

Candidates
Method Endpoint Description
POST /jobs/{job_id}/candidates/upload Upload multiple resumes
GET /jobs/{job_id}/candidates/ Retrieve candidates for a job
GET /jobs/{job_id}/candidates/{candidate_id} Retrieve candidate details

Matching
Method Endpoint Description
POST /jobs/{job_id}/matches/ Run matching and generate scores
GET /jobs/{job_id}/matches/ Retrieve ranked matching results
GET /jobs/{job_id}/matches/{candidate_id} Retrieve an individual matching result

For request and response schemas, use the interactive API documentation at /docs.
End-to-End Testing
Test the complete workflow using the frontend or the API documentation:

1. Create a job with a description, required skills, preferred skills, minimum experience, and qualifications.
2. Upload a batch of PDF or DOCX resumes.
3. Confirm that successfully processed candidates appear in the candidate list.
4. Confirm that individual file failures do not prevent the rest of the batch from being processed.
5. Run matching for the job.
6. Confirm that candidates are ranked by overall score.
7. Open a candidate profile.
8. Review the score components, matched skills, missing skills, experience evaluation, and explanation.
9. Repeat with another job to verify that candidates and results remain associated with the correct job.
   The upload endpoint supports batches of up to 50 files. Test with at least 10 resumes for a representative batch.

The backend API has been tested using Thunder Client. The complete frontend workflow has been exercised, and the frontend production build has been verified.
Current Project Status
Implemented:

- Job creation and management
- Batch PDF and DOCX resume upload
- Resume text extraction and candidate information parsing
- Job description processing
- Semantic embedding generation
- Skill normalization
- Required and preferred skill matching
- Experience evaluation
- Weighted candidate scoring
- Database-integrated match results
- Candidate ranking dashboard
- Detailed candidate profiles
- Matching explanations
- Frontend loading, error, and empty states
  Limitations and Responsible Use
- Resume parsing depends on document quality, layout, and available text. Scanned or unusually formatted documents may not parse reliably.
- Extracted experience, skills, and education can contain errors and should be checked against the original resume.
- Semantic similarity is a relevance signal, not proof of capability.
- The score is a configurable heuristic combining several signals; it is not a validated hiring or performance prediction.
- Recruiters should review the original resume and use consistent, job-related criteria before making decisions.
- Use synthetic or appropriately licensed resumes for testing. Do not commit personal candidate data to the repository.
  Future Improvements
  Potential next steps include:
- Persistent production database configuration
- More robust extraction for scanned resumes using OCR
- Expanded skill taxonomy and domain-specific normalization
- More comprehensive automated tests
- Authentication and role-based access
- Evaluation against a labeled resume–job dataset to calibrate matching weights
  TalentRank - AI-assisted resume intelligence for more transparent candidate screening.

Built with React, TypeScript, FastAPI, Python, SQLAlchemy, SQLite, and Sentence Transformers.
