from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.candidate import Candidate
from app.models.job import Job
from app.models.match_result import MatchResult
from app.schemas.match import MatchResponse
from app.services.matching_service import match_candidates


router = APIRouter(
    prefix="/jobs/{job_id}/matches",
    tags=["Matching"]
)


def build_match_responses(
    rows: list[tuple[MatchResult, Candidate]]
) -> list[dict]:
    responses = []

    for rank, (match, candidate) in enumerate(rows, start=1):
        responses.append({
            "rank": rank,
            "candidate_id": candidate.id,
            "candidate_name": candidate.name,
            "email": candidate.email,
            "overall_score": match.overall_score,
            "semantic_score": match.semantic_score,
            "required_skill_score": match.required_skill_score,
            "experience_score": match.experience_score,
            "preferred_skill_score": match.preferred_skill_score,
            "matched_skills": match.matched_skills or [],
            "missing_skills": match.missing_skills or [],
            "explanation": match.explanation,
            "created_at": match.created_at
        })

    return responses


@router.post(
    "/",
    response_model=list[MatchResponse]
)
def run_matching(
    job_id: int,
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    candidates = (
        db.query(Candidate)
        .filter(Candidate.job_id == job_id)
        .all()
    )

    if not candidates:
        raise HTTPException(
            status_code=400,
            detail="No candidates found for this job. Upload resumes first."
        )

    try:
        matching_results = match_candidates(
            job,
            candidates
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    candidate_ids = [
        result["candidate_id"]
        for result in matching_results
    ]

    existing_matches = (
        db.query(MatchResult)
        .filter(MatchResult.candidate_id.in_(candidate_ids))
        .all()
    )

    match_lookup = {
        match.candidate_id: match
        for match in existing_matches
    }

    try:
        for result in matching_results:
            candidate_id = result["candidate_id"]

            match = match_lookup.get(candidate_id)

            if match is None:
                match = MatchResult(
                    candidate_id=candidate_id,
                    overall_score=result["overall_score"],
                    required_skill_score=result["required_skill_score"],
                    semantic_score=result["semantic_score"],
                    experience_score=result["experience_score"],
                    preferred_skill_score=result["preferred_skill_score"],
                    matched_skills=result["matched_skills"],
                    missing_skills=result["missing_skills"],
                    explanation=result["explanation"]
                )

                db.add(match)

            else:
                match.overall_score = result["overall_score"]
                match.required_skill_score = result["required_skill_score"]
                match.semantic_score = result["semantic_score"]
                match.experience_score = result["experience_score"]
                match.preferred_skill_score = result["preferred_skill_score"]
                match.matched_skills = result["matched_skills"]
                match.missing_skills = result["missing_skills"]
                match.explanation = result["explanation"]

        db.commit()

    except Exception:
        db.rollback()
        raise

    rows = (
        db.query(MatchResult, Candidate)
        .join(
            Candidate,
            MatchResult.candidate_id == Candidate.id
        )
        .filter(Candidate.job_id == job_id)
        .order_by(
            MatchResult.overall_score.desc(),
            MatchResult.id.asc()
        )
        .all()
    )

    return build_match_responses(rows)


@router.get(
    "/",
    response_model=list[MatchResponse]
)
def get_match_results(
    job_id: int,
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    rows = (
        db.query(MatchResult, Candidate)
        .join(
            Candidate,
            MatchResult.candidate_id == Candidate.id
        )
        .filter(Candidate.job_id == job_id)
        .order_by(
            MatchResult.overall_score.desc(),
            MatchResult.id.asc()
        )
        .all()
    )

    return build_match_responses(rows)


@router.get(
    "/{candidate_id}",
    response_model=MatchResponse
)
def get_candidate_match(
    job_id: int,
    candidate_id: int,
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    rows = (
        db.query(MatchResult, Candidate)
        .join(
            Candidate,
            MatchResult.candidate_id == Candidate.id
        )
        .filter(Candidate.job_id == job_id)
        .order_by(
            MatchResult.overall_score.desc(),
            MatchResult.id.asc()
        )
        .all()
    )

    for response in build_match_responses(rows):
        if response["candidate_id"] == candidate_id:
            return response

    raise HTTPException(
        status_code=404,
        detail="Matching result not found for this candidate"
    )
