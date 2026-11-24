from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DailyPlanTaskResponse(BaseModel):
    id: str
    day_number: int
    week_number: int
    phase: str
    task_type: str
    title: str
    instructions: str
    estimated_minutes: int
    difficulty: str
    status: str
    completed_at: Optional[datetime] = None
    recommendation_reason: Optional[str] = None
    module_link: str

    class Config:
        from_attributes = True

class LearningPlanResponse(BaseModel):
    id: str
    user_id: str
    title: str
    target_role: str
    daily_time_budget_minutes: int
    baseline_score: float
    current_readiness_score: float
    active: bool
    total_days: int
    completed_days: int
    generated_by: str
    tasks: List[DailyPlanTaskResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class GeneratePlanRequest(BaseModel):
    target_role: Optional[str] = None
    daily_prep_time_minutes: Optional[int] = None
    regenerate: bool = False
