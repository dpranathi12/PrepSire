from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    full_name: str

class UserProfileBase(BaseModel):
    display_name: Optional[str] = None
    education: Optional[str] = None
    degree_branch: Optional[str] = None
    graduation_year: Optional[int] = None
    target_role: str = "Software Developer"
    experience_level: str = "Beginner"
    known_skills: List[str] = []
    target_skills: List[str] = []
    target_company: Optional[str] = None
    preferred_interview_type: str = "Mixed"
    communication_level: str = "Intermediate"
    daily_prep_time_minutes: int = 60
    target_interview_date: Optional[str] = None
    is_onboarded: bool = False

class UserProfileUpdate(UserProfileBase):
    pass

class UserProfileResponse(UserProfileBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserPreferencesBase(BaseModel):
    theme: str = "dark"
    ai_mode: str = "offline"  # 'offline', 'gemini', 'ollama'
    speech_language: str = "en-US"
    default_prep_seconds: int = 30
    default_speaking_seconds: int = 60
    voice_synthesis_enabled: bool = True
    voice_name: str = "default"
    speech_rate: str = "1.0"

class UserPreferencesUpdate(UserPreferencesBase):
    pass

class UserPreferencesResponse(UserPreferencesBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True

class UserResponse(UserBase):
    id: str
    is_active: bool
    is_admin: bool
    profile: Optional[UserProfileResponse] = None
    preferences: Optional[UserPreferencesResponse] = None
    created_at: datetime

    class Config:
        from_attributes = True
