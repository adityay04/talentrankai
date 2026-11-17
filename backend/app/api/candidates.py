from pathlib import Path
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.candidate import Candidate
from app.models.job import Job
from app.schemas.candidate import (
    BatchUploadResponse,
    CandidateResponse,
    CandidateUploadItem
)
from app.services.resume_extractor import extract_candidate_details
from app.services.resume_parser import (
    ResumeParserError,
    extract_resume_text
)


router = APIRouter(
    prefix="/jobs/{job_id}/candidates",
    tags=["Candidates"]
)

MAX_FILE_SIZE = 5 * 1024 * 1024
MAX_BATCH_SIZE = 50

ALLOWED_EXTENSIONS = {".pdf", ".docx"}


def validate_file_signature(
    file_bytes: bytes,
    extension: str
) -> bool:
    if extension == ".pdf":
        return file_bytes.startswith(b"%PDF-")

    if extension == ".docx":
        return file_bytes.startswith(b"PK\x03\x04")

    return False


@router.post(
    "/upload",
    response_model=BatchUploadResponse
)
async def upload_resumes(
    job_id: int,
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    if len(files) > MAX_BATCH_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum {MAX_BATCH_SIZE} files allowed per batch"
        )

    results = []
    successful_uploads = 0
    failed_uploads = 0

    try:
        for file in files:
            filename = Path(
                file.filename or "unknown"
            ).name

            extension = Path(filename).suffix.lower()

            try:
                if extension not in ALLOWED_EXTENSIONS:
                    raise ResumeParserError(
                        "Only PDF and DOCX files are supported"
                    )

                file_bytes = await file.read(
                    MAX_FILE_SIZE + 1
                )

                if len(file_bytes) > MAX_FILE_SIZE:
                    raise ResumeParserError(
                        "File exceeds the 5 MB size limit"
                    )

                if not validate_file_signature(
                    file_bytes,
                    extension
                ):
                    raise ResumeParserError(
                        "File content does not match its extension"
                    )

                resume_text = extract_resume_text(
                    file_bytes,
                    extension
                )

                details = extract_candidate_details(
                    resume_text
                )

                candidate = Candidate(
                    job_id=job_id,
                    source_filename=filename,
                    resume_text=resume_text,
                    **details
                )

                db.add(candidate)
                db.flush()

                successful_uploads += 1

                results.append(
                    CandidateUploadItem(
                        filename=filename,
                        status="success",
                        candidate_id=candidate.id,
                        name=candidate.name,
                        email=candidate.email,
                        total_experience=candidate.total_experience,
                        extracted_text_length=len(resume_text)
                    )
                )

            except ResumeParserError as exc:
                failed_uploads += 1

                results.append(
                    CandidateUploadItem(
                        filename=filename,
                        status="failed",
                        error=str(exc)
                    )
                )

            finally:
                await file.close()

        db.commit()

    except Exception:
        db.rollback()
        raise

    return BatchUploadResponse(
        job_id=job_id,
        total_files=len(files),
        successful_uploads=successful_uploads,
        failed_uploads=failed_uploads,
        results=results
    )


@router.get(
    "/",
    response_model=list[CandidateResponse]
)
def get_candidates(
    job_id: int,
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return (
        db.query(Candidate)
        .filter(Candidate.job_id == job_id)
        .order_by(Candidate.created_at.desc())
        .all()
    )


@router.get(
    "/{candidate_id}",
    response_model=CandidateResponse
)
def get_candidate(
    job_id: int,
    candidate_id: int,
    db: Session = Depends(get_db)
):
    candidate = (
        db.query(Candidate)
        .filter(
            Candidate.id == candidate_id,
            Candidate.job_id == job_id
        )
        .first()
    )

    if candidate is None:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )

    return candidate
