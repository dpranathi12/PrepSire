from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User, UserPreferences
from app.schemas.settings import AISettingsUpdate, AISettingsResponse
from app.api.deps import get_current_user
from app.core.config import settings

router = APIRouter(prefix="/settings", tags=["Settings & AI Configuration"])

@router.get("", response_model=AISettingsResponse)
def get_user_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pref = db.query(UserPreferences).filter(UserPreferences.user_id == current_user.id).first()
    active_mode = pref.ai_mode if pref else settings.DEFAULT_EVALUATION_MODE

    return AISettingsResponse(
        active_ai_mode=active_mode,
        gemini_configured=bool(settings.GEMINI_API_KEY),
        gemini_model=settings.GEMINI_MODEL,
        ollama_configured=bool(settings.OLLAMA_BASE_URL),
        ollama_base_url=settings.OLLAMA_BASE_URL,
        ollama_model=settings.OLLAMA_MODEL,
        supported_modes=["offline", "gemini", "ollama"]
    )

@router.put("", response_model=AISettingsResponse)
def update_user_settings(
    update_in: AISettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pref = db.query(UserPreferences).filter(UserPreferences.user_id == current_user.id).first()
    if not pref:
        pref = UserPreferences(user_id=current_user.id)
        db.add(pref)

    pref.ai_mode = update_in.ai_mode

    # If user provided a Gemini key, update server-side settings safely
    if update_in.gemini_api_key:
        settings.GEMINI_API_KEY = update_in.gemini_api_key.strip()
    if update_in.gemini_model:
        settings.GEMINI_MODEL = update_in.gemini_model.strip()
    if update_in.ollama_base_url:
        settings.OLLAMA_BASE_URL = update_in.ollama_base_url.strip()
    if update_in.ollama_model:
        settings.OLLAMA_MODEL = update_in.ollama_model.strip()

    db.commit()
    db.refresh(pref)

    return AISettingsResponse(
        active_ai_mode=pref.ai_mode,
        gemini_configured=bool(settings.GEMINI_API_KEY),
        gemini_model=settings.GEMINI_MODEL,
        ollama_configured=bool(settings.OLLAMA_BASE_URL),
        ollama_base_url=settings.OLLAMA_BASE_URL,
        ollama_model=settings.OLLAMA_MODEL,
        supported_modes=["offline", "gemini", "ollama"]
    )
