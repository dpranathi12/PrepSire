import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class CodingChallenge(Base):
    __tablename__ = "coding_challenges"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    difficulty = Column(String(50), default="Medium", index=True)
    topic = Column(String(100), default="Arrays", index=True)
    problem_statement = Column(Text, nullable=False)
    constraints = Column(JSON, default=list)
    input_format = Column(Text, nullable=True)
    output_format = Column(Text, nullable=True)
    sample_test_cases = Column(JSON, default=list)  # [{'input': '...', 'expected': '...', 'explanation': '...'}]
    hidden_test_cases = Column(JSON, default=list)
    starter_code = Column(JSON, default=dict)  # {'python': '...', 'javascript': '...', 'cpp': '...', 'java': '...'}
    hints = Column(JSON, default=list)
    expected_approach = Column(Text, nullable=True)
    explanation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    submissions = relationship("CodingSubmission", back_populates="challenge", cascade="all, delete-orphan")


class CodingSubmission(Base):
    __tablename__ = "coding_submissions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    challenge_id = Column(String(36), ForeignKey("coding_challenges.id", ondelete="CASCADE"), nullable=False, index=True)
    
    language = Column(String(50), default="python")
    code = Column(Text, nullable=False)
    status = Column(String(50), default="practice_submitted")  # 'passed', 'failed', 'practice_submitted', 'syntax_error'
    passed_count = Column(Integer, default=0)
    total_test_cases = Column(Integer, default=0)
    execution_mode = Column(String(50), default="practice_mode")  # 'practice_mode', 'sandboxed'
    execution_time_ms = Column(Float, default=0.0)
    feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="coding_submissions")
    challenge = relationship("CodingChallenge", back_populates="submissions")
