import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class JAMTopic(Base):
    __tablename__ = "jam_topics"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    topic_text = Column(Text, nullable=False, unique=True, index=True)
    category = Column(String(100), nullable=False, index=True)
    difficulty = Column(String(50), default="Medium")
    default_prep_seconds = Column(Integer, default=30)
    default_speaking_seconds = Column(Integer, default=60)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class JAMSession(Base):
    __tablename__ = "jam_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(String(36), ForeignKey("jam_topics.id", ondelete="SET NULL"), nullable=True)
    
    topic_text = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    prep_duration_seconds = Column(Integer, default=30)
    speaking_duration_seconds = Column(Integer, default=60)
    actual_duration_seconds = Column(Integer, default=0)
    transcript = Column(Text, nullable=False)
    response_method = Column(String(20), default="speech")  # 'typed', 'speech'
    
    # Detailed JAM Metrics
    total_score = Column(Float, default=0.0)
    fluency_score = Column(Float, default=0.0)
    content_score = Column(Float, default=0.0)
    vocab_score = Column(Float, default=0.0)
    grammar_score = Column(Float, default=0.0)
    confidence_score = Column(Float, default=0.0)
    time_management_score = Column(Float, default=0.0)
    
    filler_count = Column(Integer, default=0)
    strengths = Column(JSON, default=list)
    improvements = Column(JSON, default=list)
    sample_outline = Column(JSON, default=list)
    example_opening = Column(Text, nullable=True)
    example_closing = Column(Text, nullable=True)
    next_steps = Column(JSON, default=list)
    
    evaluation_mode = Column(String(50), default="offline")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="jam_sessions")
    topic = relationship("JAMTopic")
