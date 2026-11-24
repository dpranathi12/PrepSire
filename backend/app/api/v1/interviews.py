import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.db.session import get_db
from app.models.user import User, UserProfile
from app.models.question import Question
from app.models.interview import InterviewSession, InterviewQuestion, AnswerAttempt, AnswerEvaluation
from app.models.gamification import Badge, UserAchievement
from app.schemas.interview import (
    InterviewCreate,
    InterviewSessionResponse,
    InterviewSessionDetailResponse,
    SubmitAnswerRequest,
    AnswerEvaluationResponse
)
from app.api.deps import get_current_user
from app.services.ai_service import evaluate_interview_answer
from app.services.dynamic_question_service import generate_interview_questions

router = APIRouter(prefix="/interviews", tags=["AI Mock Interviews"])

@router.post("", response_model=InterviewSessionDetailResponse)
async def create_interview_session(
    interview_in: InterviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    req_role = (interview_in.role or "Software Developer").strip()
    req_type = (interview_in.interview_type or "Mixed").strip()
    req_diff = (interview_in.difficulty or "Medium").strip()
    total_q = max(3, min(interview_in.total_questions or 5, 10))

    # 1. Fetch user's question history to avoid repeating questions
    past_question_texts = []
    past_sessions = (
        db.query(InterviewSession)
        .filter(InterviewSession.user_id == current_user.id)
        .order_by(InterviewSession.created_at.desc())
        .limit(10)
        .all()
    )
    for s in past_sessions:
        for q in s.questions:
            if q.question_text:
                past_question_texts.append(q.question_text.strip())

    # 2. Get user profile for experience level
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    experience_level = profile.experience_level if profile else "Fresher"

    # 3. Generate fresh, role-specific questions using AI or enriched static bank
    questions_list = await generate_interview_questions(
        role=req_role,
        interview_type=req_type,
        difficulty=req_diff,
        count=total_q,
        exclude_questions=past_question_texts,
        experience_level=experience_level
    )

    # 4. Create InterviewSession record
    session_title = interview_in.title or f"{req_role} {req_type} Mock Interview"
    ai_provider = interview_in.ai_provider or "offline"
    session_obj = InterviewSession(
        user_id=current_user.id,
        title=session_title,
        role=req_role,
        interview_type=req_type,
        difficulty=req_diff,
        interview_stage=interview_in.interview_stage or f"Stage 2: {req_type} Assessment",
        total_questions=len(questions_list),
        status="in_progress",
        ai_provider=ai_provider
    )
    db.add(session_obj)
    db.flush()

    # 5. Create InterviewQuestion records
    created_questions = []
    for idx, q_text in enumerate(questions_list):
        q_lower = q_text.lower()
        # Categorize question
        if any(w in q_lower for w in ["tell me about yourself", "strength", "weakness", "why do you want",
                                       "5 years", "where do you see", "motivate", "career goal"]):
            cat = "HR"
        elif any(w in q_lower for w in ["disagree", "conflict", "mistake", "challenge", "describe a time",
                                         "tell me about a time", "give an example", "situation where"]):
            cat = "Behavioral"
        else:
            cat = "Technical"
        iq = InterviewQuestion(
            session_id=session_obj.id,
            question_id=f"dq-{idx}-{int(session_obj.created_at.timestamp())}",
            question_text=q_text,
            category=cat,
            difficulty=req_diff,
            order_index=idx,
            is_follow_up=False,
            answer_method="typed"
        )
        db.add(iq)
        created_questions.append(iq)

    db.commit()
    db.refresh(session_obj)
    return session_obj

@router.get("", response_model=List[InterviewSessionResponse])
def list_interview_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sessions = (
        db.query(InterviewSession)
        .filter(InterviewSession.user_id == current_user.id)
        .order_by(InterviewSession.created_at.desc())
        .all()
    )
    return sessions

@router.get("/{session_id}", response_model=InterviewSessionDetailResponse)
def get_interview_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session_obj = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == session_id, InterviewSession.user_id == current_user.id)
        .first()
    )
    if not session_obj:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    return session_obj

@router.post("/{session_id}/answer", response_model=AnswerEvaluationResponse)
async def submit_question_answer(
    session_id: str,
    answer_in: SubmitAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session_obj = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == session_id, InterviewSession.user_id == current_user.id)
        .first()
    )
    if not session_obj:
        raise HTTPException(status_code=404, detail="Interview session not found.")

    iq = (
        db.query(InterviewQuestion)
        .filter(InterviewQuestion.id == answer_in.interview_question_id, InterviewQuestion.session_id == session_id)
        .first()
    )
    if not iq:
        raise HTTPException(status_code=404, detail="Interview question not found in this session.")

    iq.user_answer = answer_in.user_answer
    iq.answer_method = answer_in.answer_method

    # Create AnswerAttempt
    attempt = AnswerAttempt(
        user_id=current_user.id,
        session_id=session_id,
        question_id=iq.question_id,
        question_text=iq.question_text,
        user_answer=answer_in.user_answer,
        answer_method=answer_in.answer_method,
        duration_seconds=answer_in.duration_seconds
    )
    db.add(attempt)
    db.flush()

    # Evaluate answer using the configured AI provider
    eval_result = await evaluate_interview_answer(
        question_text=iq.question_text,
        user_answer=answer_in.user_answer,
        role=session_obj.role,
        category=iq.category,
        duration_seconds=answer_in.duration_seconds,
        requested_mode=session_obj.ai_provider
    )

    evaluation = AnswerEvaluation(
        attempt_id=attempt.id,
        interview_question_id=iq.id,
        overall_score=eval_result.get("overall_score", 70.0),
        relevance_score=eval_result.get("relevance_score", 70.0),
        technical_score=eval_result.get("technical_score", 70.0),
        clarity_score=eval_result.get("clarity_score", 70.0),
        structure_score=eval_result.get("structure_score", 70.0),
        communication_score=eval_result.get("communication_score", 70.0),
        terminology_score=eval_result.get("terminology_score", 70.0),
        strengths=eval_result.get("strengths", []),
        missing_concepts=eval_result.get("missing_concepts", []),
        improvement_suggestions=eval_result.get("improvement_suggestions", []),
        sample_improved_answer=eval_result.get("sample_improved_answer"),
        star_method_used=eval_result.get("star_method_used", False),
        filler_words=eval_result.get("filler_words", []),
        filler_count=eval_result.get("filler_count", 0),
        words_per_minute=eval_result.get("words_per_minute", 0.0),
        evaluation_mode=eval_result.get("evaluation_mode", "offline")
    )
    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)

    res_dict = {
        "id": evaluation.id,
        "overall_score": evaluation.overall_score,
        "relevance_score": evaluation.relevance_score,
        "technical_score": evaluation.technical_score,
        "clarity_score": evaluation.clarity_score,
        "structure_score": evaluation.structure_score,
        "communication_score": evaluation.communication_score,
        "terminology_score": evaluation.terminology_score,
        "strengths": evaluation.strengths,
        "missing_concepts": evaluation.missing_concepts,
        "improvement_suggestions": evaluation.improvement_suggestions,
        "sample_improved_answer": evaluation.sample_improved_answer,
        "star_method_used": evaluation.star_method_used,
        "filler_words": evaluation.filler_words,
        "filler_count": evaluation.filler_count,
        "words_per_minute": evaluation.words_per_minute,
        "evaluation_mode": evaluation.evaluation_mode,
        "follow_up_question": eval_result.get("follow_up_question")
    }
    return res_dict

@router.post("/{session_id}/finish", response_model=InterviewSessionDetailResponse)
def finish_interview_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session_obj = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == session_id, InterviewSession.user_id == current_user.id)
        .first()
    )
    if not session_obj:
        raise HTTPException(status_code=404, detail="Interview session not found.")

    # Calculate aggregate scores across questions that have evaluations
    evals = (
        db.query(AnswerEvaluation)
        .join(InterviewQuestion, AnswerEvaluation.interview_question_id == InterviewQuestion.id)
        .filter(InterviewQuestion.session_id == session_id)
        .all()
    )

    if evals:
        session_obj.overall_score = round(sum(e.overall_score for e in evals) / len(evals), 1)
        session_obj.technical_score = round(sum(e.technical_score for e in evals) / len(evals), 1)
        session_obj.communication_score = round(sum(e.communication_score for e in evals) / len(evals), 1)
        session_obj.confidence_score = round(sum(e.clarity_score for e in evals) / len(evals), 1)

        all_strengths = []
        all_weaknesses = []
        for e in evals:
            all_strengths.extend(e.strengths or [])
            all_weaknesses.extend(e.improvement_suggestions or [])

        session_obj.strengths = list(dict.fromkeys(all_strengths))[:4]
        session_obj.weaknesses = list(dict.fromkeys(all_weaknesses))[:4]
        session_obj.recommended_topics = [
            f"{session_obj.role} Core Concepts",
            "System Design and Architecture",
            "STAR Response Framing for Behavioral Questions"
        ]
        session_obj.action_plan = [
            "Complete 2 JAM sessions focusing on concise sentence delivery.",
            "Review core concepts relevant to your target role.",
            "Take the 30-Day Plan diagnostic quiz."
        ]
    else:
        session_obj.overall_score = 65.0
        session_obj.technical_score = 65.0
        session_obj.communication_score = 65.0
        session_obj.confidence_score = 65.0

    session_obj.status = "completed"

    # Unlock First Interview badge if not unlocked yet
    first_interview_badge = db.query(Badge).filter(Badge.slug == "first_interview").first()
    if first_interview_badge:
        ach = db.query(UserAchievement).filter(
            UserAchievement.user_id == current_user.id,
            UserAchievement.badge_id == first_interview_badge.id
        ).first()
        if not ach:
            ach = UserAchievement(
                user_id=current_user.id,
                badge_id=first_interview_badge.id,
                unlocked_at=datetime.utcnow()
            )
            db.add(ach)

    db.commit()
    db.refresh(session_obj)
    return session_obj


@router.get("", response_model=List[InterviewSessionResponse])
def list_interview_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sessions = (
        db.query(InterviewSession)
        .filter(InterviewSession.user_id == current_user.id)
        .order_by(InterviewSession.created_at.desc())
        .all()
    )
    return sessions

@router.get("/{session_id}", response_model=InterviewSessionDetailResponse)
def get_interview_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session_obj = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == session_id, InterviewSession.user_id == current_user.id)
        .first()
    )
    if not session_obj:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    return session_obj

@router.post("/{session_id}/answer", response_model=AnswerEvaluationResponse)
async def submit_question_answer(
    session_id: str,
    answer_in: SubmitAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session_obj = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == session_id, InterviewSession.user_id == current_user.id)
        .first()
    )
    if not session_obj:
        raise HTTPException(status_code=404, detail="Interview session not found.")

    iq = (
        db.query(InterviewQuestion)
        .filter(InterviewQuestion.id == answer_in.interview_question_id, InterviewQuestion.session_id == session_id)
        .first()
    )
    if not iq:
        raise HTTPException(status_code=404, detail="Interview question not found in this session.")

    iq.user_answer = answer_in.user_answer
    iq.answer_method = answer_in.answer_method

    # Create AnswerAttempt
    attempt = AnswerAttempt(
        user_id=current_user.id,
        session_id=session_id,
        question_id=iq.question_id,
        question_text=iq.question_text,
        user_answer=answer_in.user_answer,
        answer_method=answer_in.answer_method,
        duration_seconds=answer_in.duration_seconds
    )
    db.add(attempt)
    db.flush()

    # Evaluate answer
    eval_result = await evaluate_interview_answer(
        question_text=iq.question_text,
        user_answer=answer_in.user_answer,
        role=session_obj.role,
        category=iq.category,
        duration_seconds=answer_in.duration_seconds,
        requested_mode=session_obj.ai_provider
    )

    evaluation = AnswerEvaluation(
        attempt_id=attempt.id,
        interview_question_id=iq.id,
        overall_score=eval_result.get("overall_score", 70.0),
        relevance_score=eval_result.get("relevance_score", 70.0),
        technical_score=eval_result.get("technical_score", 70.0),
        clarity_score=eval_result.get("clarity_score", 70.0),
        structure_score=eval_result.get("structure_score", 70.0),
        communication_score=eval_result.get("communication_score", 70.0),
        terminology_score=eval_result.get("terminology_score", 70.0),
        strengths=eval_result.get("strengths", []),
        missing_concepts=eval_result.get("missing_concepts", []),
        improvement_suggestions=eval_result.get("improvement_suggestions", []),
        sample_improved_answer=eval_result.get("sample_improved_answer"),
        star_method_used=eval_result.get("star_method_used", False),
        filler_words=eval_result.get("filler_words", []),
        filler_count=eval_result.get("filler_count", 0),
        words_per_minute=eval_result.get("words_per_minute", 0.0),
        evaluation_mode=eval_result.get("evaluation_mode", "offline")
    )
    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)

    res_dict = {
        "id": evaluation.id,
        "overall_score": evaluation.overall_score,
        "relevance_score": evaluation.relevance_score,
        "technical_score": evaluation.technical_score,
        "clarity_score": evaluation.clarity_score,
        "structure_score": evaluation.structure_score,
        "communication_score": evaluation.communication_score,
        "terminology_score": evaluation.terminology_score,
        "strengths": evaluation.strengths,
        "missing_concepts": evaluation.missing_concepts,
        "improvement_suggestions": evaluation.improvement_suggestions,
        "sample_improved_answer": evaluation.sample_improved_answer,
        "star_method_used": evaluation.star_method_used,
        "filler_words": evaluation.filler_words,
        "filler_count": evaluation.filler_count,
        "words_per_minute": evaluation.words_per_minute,
        "evaluation_mode": evaluation.evaluation_mode,
        "follow_up_question": eval_result.get("follow_up_question")
    }
    return res_dict

@router.post("/{session_id}/finish", response_model=InterviewSessionDetailResponse)
def finish_interview_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session_obj = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == session_id, InterviewSession.user_id == current_user.id)
        .first()
    )
    if not session_obj:
        raise HTTPException(status_code=404, detail="Interview session not found.")

    # Calculate aggregate scores across questions that have evaluations
    evals = (
        db.query(AnswerEvaluation)
        .join(InterviewQuestion, AnswerEvaluation.interview_question_id == InterviewQuestion.id)
        .filter(InterviewQuestion.session_id == session_id)
        .all()
    )

    if evals:
        session_obj.overall_score = round(sum(e.overall_score for e in evals) / len(evals), 1)
        session_obj.technical_score = round(sum(e.technical_score for e in evals) / len(evals), 1)
        session_obj.communication_score = round(sum(e.communication_score for e in evals) / len(evals), 1)
        session_obj.confidence_score = round(sum(e.clarity_score for e in evals) / len(evals), 1)
        
        all_strengths = []
        all_weaknesses = []
        for e in evals:
            all_strengths.extend(e.strengths or [])
            all_weaknesses.extend(e.improvement_suggestions or [])
        
        session_obj.strengths = list(dict.fromkeys(all_strengths))[:4]
        session_obj.weaknesses = list(dict.fromkeys(all_weaknesses))[:4]
        session_obj.recommended_topics = [f"{session_obj.role} Core Architecture", "System Design Trade-offs", "STAR Response Framing"]
        session_obj.action_plan = [
            "Complete 2 JAM sessions focusing on concise sentence delivery.",
            "Review core data structures relevant to your target role.",
            "Take the 30-Day Plan Day 8 diagnostic quiz."
        ]
    else:
        session_obj.overall_score = 65.0
        session_obj.technical_score = 65.0
        session_obj.communication_score = 65.0
        session_obj.confidence_score = 65.0

    session_obj.status = "completed"

    # Unlock First Interview badge if not unlocked yet
    first_interview_badge = db.query(Badge).filter(Badge.slug == "first_interview").first()
    if first_interview_badge:
        ach = db.query(UserAchievement).filter(
            UserAchievement.user_id == current_user.id,
            UserAchievement.badge_id == first_interview_badge.id
        ).first()
        if not ach:
            ach = UserAchievement(
                user_id=current_user.id,
                badge_id=first_interview_badge.id,
                unlocked_at=datetime.utcnow()
            )
            db.add(ach)

    db.commit()
    db.refresh(session_obj)
    return session_obj
