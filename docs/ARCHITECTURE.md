# TalentRank AI - Architecture

## Overview

TalentRank AI is an AI-powered resume matching and candidate ranking application.

It compares multiple candidate resumes against a job description and produces explainable matching scores.

## Technology Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Python, FastAPI
- Database: SQLite
- ORM: SQLAlchemy
- NLP: spaCy
- Embeddings: Sentence Transformers
- Machine Learning: scikit-learn

## Architecture

The application follows a layered architecture.

### Frontend

Responsible for job description input, resume uploads, candidate rankings and candidate-level analysis.

### API Layer

FastAPI exposes REST endpoints and handles HTTP requests.

### Service Layer

Responsible for resume parsing, information extraction, semantic matching and candidate scoring.

### Database Layer

SQLAlchemy manages database interactions.

SQLite stores jobs, candidates and matching results.

## Database Entities

### Job

Stores job descriptions, required skills, preferred skills, experience requirements and qualifications.

### Candidate

Stores extracted candidate information and resume text.

### MatchResult

Stores overall matching scores, individual score components, matched skills, missing skills and explanations.

## Matching Architecture

The matching engine will combine:

1. Skill matching
2. Semantic similarity
3. Relevant experience
4. Educational qualification matching

The final score will be calculated using a weighted scoring algorithm.

## API Documentation

FastAPI Swagger documentation is available at:

http://127.0.0.1:8000/docs
