import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    preferences = relationship("UserPreferences", back_populates="user", uselist=False, cascade="all, delete-orphan")
    interview_sessions = relationship("InterviewSession", back_populates="user", cascade="all, delete-orphan")
    answer_attempts = relationship("AnswerAttempt", back_populates="user", cascade="all, delete-orphan")
    communication_sessions = relationship("CommunicationSession", back_populates="user", cascade="all, delete-orphan")
    jam_sessions = relationship("JAMSession", back_populates="user", cascade="all, delete-orphan")
    quiz_attempts = relationship("QuizAttempt", back_populates="user", cascade="all, delete-orphan")
    coding_submissions = relationship("CodingSubmission", back_populates="user", cascade="all, delete-orphan")
    learning_plans = relationship("LearningPlan", back_populates="user", cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    display_name = Column(String(255), nullable=True)
    education = Column(String(255), nullable=True)
    degree_branch = Column(String(255), nullable=True)
    graduation_year = Column(Integer, nullable=True)
    target_role = Column(String(255), default="Software Developer", nullable=False)
    experience_level = Column(String(50), default="Beginner", nullable=False)
    known_skills = Column(JSON, default=list)
    target_skills = Column(JSON, default=list)
    target_company = Column(String(255), nullable=True)
    preferred_interview_type = Column(String(50), default="Mixed")
    communication_level = Column(String(50), default="Intermediate")
    daily_prep_time_minutes = Column(Integer, default=60)
    target_interview_date = Column(String(50), nullable=True)
    is_onboarded = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="profile")


class UserPreferences(Base):
    __tablename__ = "user_preferences"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    theme = Column(String(20), default="dark")
    ai_mode = Column(String(50), default="offline")  # 'offline', 'gemini', 'ollama'
    speech_language = Column(String(20), default="en-US")
    default_prep_seconds = Column(Integer, default=30)
    default_speaking_seconds = Column(Integer, default=60)
    voice_synthesis_enabled = Column(Boolean, default=True)
    voice_name = Column(String(100), default="default")
    speech_rate = Column(String(20), default="1.0")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="preferences")
