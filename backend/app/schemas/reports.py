from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class SessionComparisonRequest(BaseModel):
    session_id_1: str
    session_id_2: str
    session_type: str  # 'interview', 'communication', 'jam', 'quiz'

class CriterionDiff(BaseModel):
    criterion: str
    session_1_score: float
    session_2_score: float
    difference: float

class SessionComparisonResponse(BaseModel):
    session_type: str
    session_1_id: str
    session_2_id: str
    session_1_date: str
    session_2_date: str
    score_1: float
    score_2: float
    point_difference: float
    is_approximate_comparison: bool
    criterion_differences: List[CriterionDiff] = []
    skills_improved: List[str] = []
    persistent_weaknesses: List[str] = []
    recommended_next_activities: List[str] = []

class SessionSummaryItem(BaseModel):
    session_id: str
    session_type: str  # 'mock_interview', 'communication', 'jam', 'quiz', 'coding'
    title: str
    date: datetime
    score: float
    details: Dict[str, Any] = {}
