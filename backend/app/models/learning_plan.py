import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class LearningPlan(Base):
    __tablename__ = "learning_plans"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), default="Personalized 30-Day Placement Plan", nullable=False)
    target_role = Column(String(255), default="Software Developer", nullable=False)
    daily_time_budget_minutes = Column(Integer, default=60, nullable=False)
    baseline_score = Column(Float, default=50.0)
    current_readiness_score = Column(Float, default=50.0)
    active = Column(Boolean, default=True)
    total_days = Column(Integer, default=30)
    completed_days = Column(Integer, default=0)
    generated_by = Column(String(50), default="rule_engine")  # 'rule_engine', 'gemini'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="learning_plans")
    tasks = relationship("DailyPlanTask", back_populates="plan", cascade="all, delete-orphan", order_by="DailyPlanTask.day_number, DailyPlanTask.id")


class DailyPlanTask(Base):
    __tablename__ = "daily_plan_tasks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    plan_id = Column(String(36), ForeignKey("learning_plans.id", ondelete="CASCADE"), nullable=False, index=True)
    day_number = Column(Integer, nullable=False, index=True)
    week_number = Column(Integer, nullable=False)
    phase = Column(String(100), nullable=False)  # 'Foundation', 'Skill Development', 'Interview Application', 'Final Revision'
    task_type = Column(String(50), nullable=False)  # 'learning_topic', 'academic_assignment', 'practice_activity', 'interview_question', 'speaking_task'
    title = Column(String(255), nullable=False)
    instructions = Column(Text, nullable=False)
    estimated_minutes = Column(Integer, default=15)
    difficulty = Column(String(50), default="Medium")
    status = Column(String(50), default="pending")  # 'pending', 'completed'
    completed_at = Column(DateTime, nullable=True)
    recommendation_reason = Column(Text, nullable=True)
    module_link = Column(String(100), default="dashboard")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    plan = relationship("LearningPlan", back_populates="tasks")
