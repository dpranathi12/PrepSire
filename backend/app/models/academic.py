import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class AcademicQuestion(Base):
    __tablename__ = "academic_questions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    subject = Column(String(100), nullable=False, index=True)
    topic = Column(String(100), nullable=False, index=True)
    difficulty = Column(String(50), default="Medium", nullable=False)
    question_type = Column(String(50), default="mcq")  # 'mcq', 'short', 'conceptual', 'scenario'
    question_text = Column(Text, nullable=False)
    options = Column(JSON, nullable=True)  # List of strings for MCQs
    correct_answer = Column(Text, nullable=False)
    explanation = Column(Text, nullable=False)
    source = Column(String(50), default="curated_bank")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    subject = Column(String(100), nullable=False, index=True)
    topic = Column(String(100), nullable=True)
    score = Column(Float, default=0.0)
    total_questions = Column(Integer, default=0)
    correct_count = Column(Integer, default=0)
    answers_detail = Column(JSON, default=list)  # [{'question_id', 'question_text', 'user_answer', 'correct_answer', 'is_correct'}]
    time_taken_seconds = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="quiz_attempts")
