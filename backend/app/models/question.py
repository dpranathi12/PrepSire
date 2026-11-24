import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON, Index
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class Question(Base):
    __tablename__ = "questions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    question_text = Column(Text, nullable=False, index=True)
    normalized_question = Column(Text, nullable=False, index=True)
    keywords = Column(JSON, default=list)
    role = Column(String(255), nullable=False, index=True)
    sector = Column(String(255), nullable=True, index=True)
    interview_stage = Column(String(255), nullable=True, index=True)
    interviewer = Column(Text, nullable=True)
    question_category = Column(String(255), nullable=True, index=True)
    question_level = Column(String(100), nullable=True, index=True)
    source = Column(String(50), default="imported_dataset")  # 'imported_dataset', 'curated_question_bank', 'ai_generated'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        Index("idx_q_role_category", "role", "question_category"),
        Index("idx_q_role_stage", "role", "interview_stage"),
    )

class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    item_type = Column(String(50), nullable=False)  # 'question', 'prompt', 'jam_topic', 'academic', 'coding'
    item_id = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="bookmarks")
