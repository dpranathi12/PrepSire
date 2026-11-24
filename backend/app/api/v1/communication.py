from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.db.session import get_db
from app.models.user import User
from app.models.communication import CommunicationPrompt, CommunicationSession
from app.models.gamification import Badge, UserAchievement
from app.schemas.communication import (
    CommunicationPromptResponse,
    SubmitCommunicationRequest,
    CommunicationSessionResponse
)
from app.api.deps import get_current_user
from app.services.evaluation_engine import evaluate_communication_offline

router = APIRouter(prefix="/communication", tags=["Communication Practice"])

import random

@router.get("/prompts", response_model=List[CommunicationPromptResponse])
def get_communication_prompts(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    exclude_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(CommunicationPrompt)
    if category and category.lower() not in ["all", "all categories"]:
        q = q.filter(CommunicationPrompt.category.ilike(f"%{category}%"))
    if difficulty and difficulty.lower() not in ["all", "all difficulties"]:
        q = q.filter(CommunicationPrompt.difficulty.ilike(f"%{difficulty}%"))
    if exclude_id:
        q = q.filter(CommunicationPrompt.id != exclude_id)
    
    prompts = q.all()
    if not prompts:
        # Fallback to all prompts if specific category has no match
        prompts = db.query(CommunicationPrompt).all()

    random.shuffle(prompts)
    return prompts

@router.get("/random-prompt", response_model=CommunicationPromptResponse)
def get_random_communication_prompt(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    exclude_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(CommunicationPrompt)
    if category and category.lower() not in ["all", "all categories"]:
        q = q.filter(CommunicationPrompt.category.ilike(f"%{category}%"))
    if difficulty and difficulty.lower() not in ["all", "all difficulties"]:
        q = q.filter(CommunicationPrompt.difficulty.ilike(f"%{difficulty}%"))
    if exclude_id:
        q = q.filter(CommunicationPrompt.id != exclude_id)

    prompts = q.all()
    if not prompts:
        prompts = db.query(CommunicationPrompt).all()
        if not prompts:
            raise HTTPException(status_code=404, detail="No communication prompts found.")

    return random.choice(prompts)

@router.post("/sessions", response_model=CommunicationSessionResponse)
def submit_communication_session(
    comm_in: SubmitCommunicationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    eval_res = evaluate_communication_offline(
        prompt_text=comm_in.prompt_text,
        response_text=comm_in.response_text,
        category=comm_in.category,
        duration_seconds=comm_in.response_duration_seconds
    )

    session_obj = CommunicationSession(
        user_id=current_user.id,
        prompt_id=comm_in.prompt_id,
        category=comm_in.category,
        difficulty="Beginner",
        prompt_text=comm_in.prompt_text,
        prep_time_seconds=comm_in.prep_time_seconds,
        response_duration_seconds=comm_in.response_duration_seconds,
        actual_duration_seconds=comm_in.actual_duration_seconds,
        response_text=comm_in.response_text,
        response_method=comm_in.response_method,
        overall_score=eval_res["overall_score"],
        relevance_score=eval_res["relevance_score"],
        clarity_score=eval_res["clarity_score"],
        structure_score=eval_res["structure_score"],
        grammar_score=eval_res["grammar_score"],
        vocabulary_score=eval_res["vocabulary_score"],
        conciseness_score=eval_res["conciseness_score"],
        filler_words=eval_res["filler_words"],
        filler_count=eval_res["filler_count"],
        words_per_minute=eval_res["words_per_minute"],
        strengths=eval_res["strengths"],
        weaknesses=eval_res["weaknesses"],
        alternative_expressions=eval_res["alternative_expressions"],
        improved_sample_answer=eval_res["improved_sample_answer"],
        next_step_recommendation=eval_res["next_step_recommendation"],
        evaluation_mode=eval_res["evaluation_mode"]
    )
    db.add(session_obj)

    # Unlock Communication Starter badge
    badge = db.query(Badge).filter(Badge.slug == "communication_starter").first()
    if badge:
        ach = db.query(UserAchievement).filter(
            UserAchievement.user_id == current_user.id,
            UserAchievement.badge_id == badge.id
        ).first()
        if not ach:
            ach = UserAchievement(user_id=current_user.id, badge_id=badge.id, unlocked_at=datetime.utcnow())
            db.add(ach)

    db.commit()
    db.refresh(session_obj)
    return session_obj

@router.get("/sessions", response_model=List[CommunicationSessionResponse])
def list_communication_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(CommunicationSession)
        .filter(CommunicationSession.user_id == current_user.id)
        .order_by(CommunicationSession.created_at.desc())
        .all()
    )
