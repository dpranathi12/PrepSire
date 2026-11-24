from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.db.session import get_db
from app.models.question import Question
from app.schemas.interview import QuestionResponse

router = APIRouter(prefix="/questions", tags=["Questions Bank"])

@router.get("/search", response_model=List[QuestionResponse])
def search_questions(
    role: Optional[str] = None,
    category: Optional[str] = None,
    level: Optional[str] = None,
    stage: Optional[str] = None,
    query: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    q = db.query(Question)
    if role:
        q = q.filter(Question.role.ilike(f"%{role}%"))
    if category:
        q = q.filter(Question.question_category.ilike(f"%{category}%"))
    if level:
        q = q.filter(Question.question_level.ilike(f"%{level}%"))
    if stage:
        q = q.filter(Question.interview_stage.ilike(f"%{stage}%"))
    if query:
        q = q.filter(Question.question_text.ilike(f"%{query}%"))

    return q.offset(offset).limit(limit).all()

@router.get("/roles", response_model=List[str])
def get_distinct_roles(db: Session = Depends(get_db)):
    results = db.query(Question.role).distinct().order_by(Question.role).all()
    return [r[0] for r in results if r[0]]

@router.get("/categories", response_model=List[str])
def get_distinct_categories(db: Session = Depends(get_db)):
    results = db.query(Question.question_category).distinct().order_by(Question.question_category).all()
    return [r[0] for r in results if r[0]]

@router.get("/stages", response_model=List[str])
def get_distinct_stages(db: Session = Depends(get_db)):
    results = db.query(Question.interview_stage).distinct().order_by(Question.interview_stage).all()
    return [r[0] for r in results if r[0]]

@router.get("/sectors", response_model=List[str])
def get_distinct_sectors(db: Session = Depends(get_db)):
    results = db.query(Question.sector).distinct().order_by(Question.sector).all()
    return [r[0] for r in results if r[0]]
