from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.db.session import get_db
from app.models.user import User
from app.models.coding import CodingChallenge, CodingSubmission
from app.models.gamification import Badge, UserAchievement
from app.schemas.coding import (
    CodingChallengeResponse,
    SubmitCodingRequest,
    CodingSubmissionResponse,
    RunCodeResponse
)
from app.api.deps import get_current_user
from app.services.code_executor import execute_submitted_code

router = APIRouter(prefix="/coding", tags=["Coding Practice"])

@router.get("/challenges", response_model=List[CodingChallengeResponse])
def list_coding_challenges(db: Session = Depends(get_db)):
    return db.query(CodingChallenge).all()

@router.get("/challenges/{slug}", response_model=CodingChallengeResponse)
def get_coding_challenge(slug: str, db: Session = Depends(get_db)):
    challenge = db.query(CodingChallenge).filter(CodingChallenge.slug == slug).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Coding challenge not found.")
    return challenge

@router.post("/run", response_model=RunCodeResponse)
def run_code_against_samples(
    sub_in: SubmitCodingRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    challenge = db.query(CodingChallenge).filter(CodingChallenge.id == sub_in.challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Coding challenge not found.")

    res = execute_submitted_code(
        language=sub_in.language,
        code=sub_in.code,
        sample_test_cases=challenge.sample_test_cases or [],
        hidden_test_cases=[]
    )
    return RunCodeResponse(**res)

@router.post("/submit", response_model=CodingSubmissionResponse)
def submit_code_solution(
    sub_in: SubmitCodingRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    challenge = db.query(CodingChallenge).filter(CodingChallenge.id == sub_in.challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Coding challenge not found.")

    code_text = sub_in.code.strip()
    
    # Real execution against all test cases
    exec_result = execute_submitted_code(
        language=sub_in.language,
        code=code_text,
        sample_test_cases=challenge.sample_test_cases or [],
        hidden_test_cases=challenge.hidden_test_cases or []
    )

    submission = CodingSubmission(
        user_id=current_user.id,
        challenge_id=challenge.id,
        language=sub_in.language,
        code=code_text,
        status=exec_result.get("status", "passed"),
        passed_count=exec_result.get("passed_count", 0),
        total_test_cases=exec_result.get("total_test_cases", 0),
        execution_mode="real_execution",
        execution_time_ms=exec_result.get("execution_time_ms", 15.0),
        feedback=exec_result.get("feedback")
    )
    db.add(submission)

    # Check for Ten Coding Problems badge
    submissions_count = db.query(CodingSubmission).filter(CodingSubmission.user_id == current_user.id).count()
    if submissions_count >= 10:
        badge = db.query(Badge).filter(Badge.slug == "ten_coding_problems").first()
        if badge:
            ach = db.query(UserAchievement).filter(
                UserAchievement.user_id == current_user.id,
                UserAchievement.badge_id == badge.id
            ).first()
            if not ach:
                ach = UserAchievement(user_id=current_user.id, badge_id=badge.id, unlocked_at=datetime.utcnow())
                db.add(ach)

    db.commit()
    db.refresh(submission)
    
    resp_data = CodingSubmissionResponse(
        id=submission.id,
        user_id=submission.user_id,
        challenge_id=submission.challenge_id,
        language=submission.language,
        code=submission.code,
        status=submission.status,
        passed_count=submission.passed_count,
        total_test_cases=submission.total_test_cases,
        execution_mode=submission.execution_mode,
        execution_time_ms=submission.execution_time_ms,
        feedback=submission.feedback,
        test_results=exec_result.get("test_results", []),
        created_at=submission.created_at
    )
    return resp_data

@router.get("/submissions", response_model=List[CodingSubmissionResponse])
def get_user_submissions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(CodingSubmission)
        .filter(CodingSubmission.user_id == current_user.id)
        .order_by(CodingSubmission.created_at.desc())
        .all()
    )
