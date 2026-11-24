from pydantic import BaseModel
from typing import Optional

class AISettingsUpdate(BaseModel):
    ai_mode: str  # 'offline', 'gemini', 'ollama'
    gemini_api_key: Optional[str] = None
    gemini_model: Optional[str] = None
    ollama_base_url: Optional[str] = None
    ollama_model: Optional[str] = None

class AISettingsResponse(BaseModel):
    active_ai_mode: str
    gemini_configured: bool
    gemini_model: str
    ollama_configured: bool
    ollama_base_url: str
    ollama_model: str
    supported_modes: list[str] = ["offline", "gemini", "ollama"]
