import os
from typing import List, Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "PrepSpire AI"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    _backend_dir: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    _default_db_path: str = os.path.join(_backend_dir, "prepspire.db").replace("\\", "/")
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{_default_db_path}")
    
    # JWT & Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "prepspire_super_secret_key_jwt_2026_dev_mode_secure")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Dataset
    DATASET_PATH: str = os.getenv("DATASET_PATH", os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "interview_forge_v3_complete.csv"))
    
    # AI Services
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    
    # Ollama Configuration (local AI provider)
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "qwen2.5:7b")
    OLLAMA_TIMEOUT: float = float(os.getenv("OLLAMA_TIMEOUT", "90"))
    
    # AI Mode: "ollama" | "gemini" | "offline"
    # - "ollama": Use local Ollama for real AI inference (recommended)
    # - "gemini": Use Google Gemini API (requires GEMINI_API_KEY)
    # - "offline": Use heuristic evaluation engine (no AI, always available)
    DEFAULT_EVALUATION_MODE: str = os.getenv("DEFAULT_EVALUATION_MODE", "offline")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

