import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False, index=True)
    interview_type = Column(String(50), default="Mixed", nullable=False)  # 'HR', 'Technical', 'Behavioral', 'Mixed'
    difficulty = Column(String(50), default="Medium", nullable=False)
    interview_stage = Column(String(255), nullable=True)
    total_questions = Column(Integer, default=5, nullable=False)
    status = Column(String(50), default="in_progress")  # 'in_progress', 'completed', 'abandoned'
    
    # Aggregated Scores
    overall_score = Column(Float, default=0.0)
    communication_score = Column(Float, default=0.0)
    technical_score = Column(Float, default=0.0)
    confidence_score = Column(Float, default=0.0)
    
    # Aggregated Insights
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    recommended_topics = Column(JSON, default=list)
    action_plan = Column(JSON, default=list)
    
    ai_provider = Column(String(50), default="offline")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="interview_sessions")
    questions = relationship("InterviewQuestion", back_populates="session", cascade="all, delete-orphan", order_by="InterviewQuestion.order_index")
    attempts = relationship("AnswerAttempt", back_populates="session", cascade="all, delete-orphan")


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(String(36), ForeignKey("questions.id", ondelete="SET NULL"), nullable=True)
    question_text = Column(Text, nullable=False)
    category = Column(String(50), default="Technical")
    difficulty = Column(String(50), default="Medium")
    order_index = Column(Integer, default=0)
    is_follow_up = Column(Boolean, default=False)
    user_answer = Column(Text, nullable=True)
    answer_method = Column(String(20), default="typed")  # 'typed', 'speech'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    session = relationship("InterviewSession", back_populates="questions")
    question_ref = relationship("Question")
    evaluation = relationship("AnswerEvaluation", back_populates="interview_question", uselist=False, cascade="all, delete-orphan")


class AnswerAttempt(Base):
    __tablename__ = "answer_attempts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    session_id = Column(String(36), ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=True, index=True)
    question_id = Column(String(36), ForeignKey("questions.id", ondelete="SET NULL"), nullable=True)
    question_text = Column(Text, nullable=False)
    user_answer = Column(Text, nullable=False)
    answer_method = Column(String(20), default="typed")
    duration_seconds = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="answer_attempts")
    session = relationship("InterviewSession", back_populates="attempts")
    evaluation = relationship("AnswerEvaluation", back_populates="attempt", uselist=False, cascade="all, delete-orphan")


class AnswerEvaluation(Base):
    __tablename__ = "answer_evaluations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    attempt_id = Column(String(36), ForeignKey("answer_attempts.id", ondelete="CASCADE"), nullable=True, unique=True)
    interview_question_id = Column(String(36), ForeignKey("interview_questions.id", ondelete="CASCADE"), nullable=True, unique=True)
    
    overall_score = Column(Float, default=0.0)
    relevance_score = Column(Float, default=0.0)
    technical_score = Column(Float, default=0.0)
    clarity_score = Column(Float, default=0.0)
    structure_score = Column(Float, default=0.0)
    communication_score = Column(Float, default=0.0)
    terminology_score = Column(Float, default=0.0)
    
    strengths = Column(JSON, default=list)
    missing_concepts = Column(JSON, default=list)
    improvement_suggestions = Column(JSON, default=list)
    sample_improved_answer = Column(Text, nullable=True)
    star_method_used = Column(Boolean, default=False)
    filler_words = Column(JSON, default=list)
    filler_count = Column(Integer, default=0)
    words_per_minute = Column(Float, default=0.0)
    
    evaluation_mode = Column(String(50), default="offline")  # 'offline', 'gemini', 'ollama'
    raw_ai_feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    attempt = relationship("AnswerAttempt", back_populates="evaluation")
    interview_question = relationship("InterviewQuestion", back_populates="evaluation")
