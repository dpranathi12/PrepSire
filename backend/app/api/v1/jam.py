from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.db.session import get_db
from app.models.user import User
from app.models.jam import JAMTopic, JAMSession
from app.models.gamification import Badge, UserAchievement
from app.schemas.jam import (
    JAMTopicResponse,
    SubmitJAMRequest,
    JAMSessionResponse
)
from app.api.deps import get_current_user
from app.services.jam_service import get_next_jam_topic
from app.services.evaluation_engine import evaluate_jam_offline

router = APIRouter(prefix="/jam", tags=["Just-A-Minute (JAM)"])

@router.get("/topic", response_model=JAMTopicResponse)
def fetch_jam_topic(
    category: Optional[str] = None,
    allow_retry_id: Optional[str] = None,
    exclude_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    topic, is_revision, cooldown_active = get_next_jam_topic(
        db=db,
        user_id=current_user.id,
        category=category,
        allow_retry_id=allow_retry_id,
        exclude_id=exclude_id,
        cooldown_days=30
    )
    return JAMTopicResponse(
        id=topic.id,
        topic_text=topic.topic_text,
        category=topic.category,
        difficulty=topic.difficulty,
        default_prep_seconds=15,  # Preserved 15s preparation time
        default_speaking_seconds=60, # Preserved 1 minute speaking time
        is_revision=is_revision,
        cooldown_active=cooldown_active
    )

@router.post("/sessions", response_model=JAMSessionResponse)
def submit_jam_session(
    jam_in: SubmitJAMRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    eval_res = evaluate_jam_offline(
        topic_text=jam_in.topic_text,
        transcript=jam_in.transcript,
        prep_duration=jam_in.prep_duration_seconds,
        speaking_duration=jam_in.speaking_duration_seconds
    )

    session_obj = JAMSession(
        user_id=current_user.id,
        topic_id=jam_in.topic_id,
        topic_text=jam_in.topic_text,
        category=jam_in.category,
        prep_duration_seconds=jam_in.prep_duration_seconds,
        speaking_duration_seconds=jam_in.speaking_duration_seconds,
        actual_duration_seconds=jam_in.actual_duration_seconds,
        transcript=jam_in.transcript,
        response_method=jam_in.response_method,
        total_score=eval_res["total_score"],
        fluency_score=eval_res["fluency_score"],
        content_score=eval_res["content_score"],
        vocab_score=eval_res["vocab_score"],
        grammar_score=eval_res["grammar_score"],
        confidence_score=eval_res["confidence_score"],
        time_management_score=eval_res["time_management_score"],
        filler_count=eval_res["filler_count"],
        strengths=eval_res["strengths"],
        improvements=eval_res["improvements"],
        sample_outline=eval_res["sample_outline"],
        example_opening=eval_res["example_opening"],
        example_closing=eval_res["example_closing"],
        next_steps=eval_res["next_steps"],
        evaluation_mode=eval_res["evaluation_mode"]
    )
    db.add(session_obj)
    db.flush()

    # Check for Five JAM Sessions badge
    user_jams_count = db.query(JAMSession).filter(JAMSession.user_id == current_user.id).count()
    if user_jams_count >= 5:
        badge = db.query(Badge).filter(Badge.slug == "five_jam_sessions").first()
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

@router.get("/sessions", response_model=List[JAMSessionResponse])
def list_jam_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(JAMSession)
        .filter(JAMSession.user_id == current_user.id)
        .order_by(JAMSession.created_at.desc())
        .all()
    )
