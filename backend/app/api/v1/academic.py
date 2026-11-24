from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.db.session import get_db
from app.models.user import User
from app.models.academic import AcademicQuestion, QuizAttempt
from app.models.gamification import Badge, UserAchievement
from app.schemas.academic import (
    AcademicQuestionResponse,
    SubmitQuizRequest,
    QuizAttemptResponse,
    QuizAnswerDetail
)
from app.api.deps import get_current_user

router = APIRouter(prefix="/academic", tags=["Academic & Technical Preparation"])

SUBJECTS = [
    "Java",
    "Data Structures and Algorithms",
    "Object-Oriented Programming",
    "DBMS",
    "SQL",
    "Operating Systems",
    "Computer Networks",
    "Software Engineering",
    "Python",
    "C and C++",
    "Web Development",
    "Artificial Intelligence",
    "Machine Learning",
    "Aptitude and Logical Reasoning"
]

@router.get("/subjects", response_model=List[str])
def list_academic_subjects():
    return SUBJECTS

@router.get("/questions", response_model=List[AcademicQuestionResponse])
def get_academic_questions(
    subject: Optional[str] = None,
    difficulty: Optional[str] = None,
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    q = db.query(AcademicQuestion)
    if subject and subject.lower() != "all":
        q = q.filter(AcademicQuestion.subject.ilike(f"%{subject}%"))
    if difficulty and difficulty.lower() != "all":
        q = q.filter(AcademicQuestion.difficulty == difficulty)
    
    questions = q.limit(limit).all()
    if not questions:
        # Fallback to any academic questions if subject has no custom items
        questions = db.query(AcademicQuestion).limit(limit).all()
    return questions

@router.post("/quiz", response_model=QuizAttemptResponse)
def submit_quiz_attempt(
    quiz_in: SubmitQuizRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total = len(quiz_in.answers)
    if total == 0:
        raise HTTPException(status_code=400, detail="Quiz submission contains no answers.")

    details = []
    correct_count = 0

    for ans in quiz_in.answers:
        q_obj = db.query(AcademicQuestion).filter(AcademicQuestion.id == ans.question_id).first()
        if q_obj:
            is_correct = (str(ans.user_answer).strip().lower() == str(q_obj.correct_answer).strip().lower())
            if is_correct:
                correct_count += 1
            details.append({
                "question_id": q_obj.id,
                "question_text": q_obj.question_text,
                "user_answer": ans.user_answer,
                "correct_answer": q_obj.correct_answer,
                "is_correct": is_correct,
                "explanation": q_obj.explanation
            })

    score = round((correct_count / total) * 100, 1)

    attempt = QuizAttempt(
        user_id=current_user.id,
        subject=quiz_in.subject,
        topic=quiz_in.topic,
        score=score,
        total_questions=total,
        correct_count=correct_count,
        answers_detail=details,
        time_taken_seconds=quiz_in.time_taken_seconds
    )
    db.add(attempt)

    # Academic Revision Champion badge (>= 80%)
    if score >= 80.0:
        badge = db.query(Badge).filter(Badge.slug == "academic_champion").first()
        if badge:
            ach = db.query(UserAchievement).filter(
                UserAchievement.user_id == current_user.id,
                UserAchievement.badge_id == badge.id
            ).first()
            if not ach:
                ach = UserAchievement(user_id=current_user.id, badge_id=badge.id, unlocked_at=datetime.utcnow())
                db.add(ach)

    db.commit()
    db.refresh(attempt)
    return attempt

@router.get("/attempts", response_model=List[QuizAttemptResponse])
def get_quiz_attempts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == current_user.id)
        .order_by(QuizAttempt.created_at.desc())
        .all()
    )
