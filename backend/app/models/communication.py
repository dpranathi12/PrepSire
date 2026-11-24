import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class CommunicationPrompt(Base):
    __tablename__ = "communication_prompts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    category = Column(String(100), nullable=False, index=True)
    difficulty = Column(String(50), default="Beginner", nullable=False)
    prompt_text = Column(Text, nullable=False)
    prep_time_seconds = Column(Integer, default=30)
    speaking_time_seconds = Column(Integer, default=120)
    tags = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class CommunicationSession(Base):
    __tablename__ = "communication_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    prompt_id = Column(String(36), ForeignKey("communication_prompts.id", ondelete="SET NULL"), nullable=True)
    
    category = Column(String(100), nullable=False)
    difficulty = Column(String(50), default="Beginner")
    prompt_text = Column(Text, nullable=False)
    prep_time_seconds = Column(Integer, default=30)
    response_duration_seconds = Column(Integer, default=120)
    actual_duration_seconds = Column(Integer, default=0)
    response_text = Column(Text, nullable=False)
    response_method = Column(String(20), default="typed")  # 'typed', 'speech'
    
    # Detailed Evaluation
    overall_score = Column(Float, default=0.0)
    relevance_score = Column(Float, default=0.0)
    clarity_score = Column(Float, default=0.0)
    structure_score = Column(Float, default=0.0)
    grammar_score = Column(Float, default=0.0)
    vocabulary_score = Column(Float, default=0.0)
    conciseness_score = Column(Float, default=0.0)
    
    filler_words = Column(JSON, default=list)
    filler_count = Column(Integer, default=0)
    words_per_minute = Column(Float, default=0.0)
    
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    alternative_expressions = Column(JSON, default=list)
    improved_sample_answer = Column(Text, nullable=True)
    next_step_recommendation = Column(Text, nullable=True)
    evaluation_mode = Column(String(50), default="offline")
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="communication_sessions")
    prompt = relationship("CommunicationPrompt")
