from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from app.db.session import get_db
from app.models.user import User, UserProfile
from app.models.interview import InterviewSession
from app.models.academic import QuizAttempt
from app.api.deps import get_optional_current_user
from app.services.ai_service import get_career_coach_response
from app.services.ollama_service import check_ollama_health

router = APIRouter(prefix="/coach", tags=["AI Career Coach"])

class CoachMessageRequest(BaseModel):
    message: str
    ai_mode: Optional[str] = None
    history: Optional[List[Dict[str, Any]]] = None

class CoachMessageResponse(BaseModel):
    reply: str
    mode: str  # 'offline', 'gemini', or 'ollama'

@router.get("/providers/status")
async def get_provider_status():
    """Check availability of all AI providers."""
    from app.core.config import settings
    
    ollama_status = await check_ollama_health()
    
    return {
        "providers": {
            "ollama": {
                "available": ollama_status["available"],
                "model_ready": ollama_status["model_ready"],
                "model": ollama_status["model"],
                "base_url": settings.OLLAMA_BASE_URL,
                "available_models": ollama_status.get("available_models", [])
            },
            "gemini": {
                "available": bool(settings.GEMINI_API_KEY),
                "model": settings.GEMINI_MODEL,
                "configured": bool(settings.GEMINI_API_KEY)
            },
            "offline": {
                "available": True,
                "description": "Heuristic evaluation engine — always available"
            }
        },
        "default_mode": settings.DEFAULT_EVALUATION_MODE
    }

@router.post("/message", response_model=CoachMessageResponse)
async def send_coach_message(
    req: CoachMessageRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first() if current_user else None
    profile_summary = {
        "display_name": profile.display_name if profile else (current_user.full_name if current_user else "Student"),
        "target_role": profile.target_role if profile else "Software Developer",
        "experience_level": profile.experience_level if profile else "Fresher",
        "known_skills": profile.known_skills if profile else [],
        "target_skills": profile.target_skills if profile else []
    }

    # Performance summary
    user_id = current_user.id if current_user else 1
    interviews = db.query(InterviewSession).filter(InterviewSession.user_id == user_id, InterviewSession.status == "completed").all()
    avg_score = round(sum(i.overall_score for i in interviews) / len(interviews), 1) if interviews else 58.0
    quizzes = db.query(QuizAttempt).filter(QuizAttempt.user_id == user_id).all()
    avg_quiz = round(sum(q.score for q in quizzes) / len(quizzes), 1) if quizzes else 60.0

    perf_summary = {
        "completed_interviews": len(interviews),
        "average_interview_score": avg_score,
        "average_quiz_score": avg_quiz,
        "weakest_subject": "System Design Trade-offs" if avg_score < 70 else "Behavioral Conflict Resolution"
    }

    res = await get_career_coach_response(
        user_message=req.message,
        profile_summary=profile_summary,
        performance_summary=perf_summary,
        conversation_history=req.history,
        requested_mode=req.ai_mode
    )

    return CoachMessageResponse(reply=res["reply"], mode=res["mode"])

