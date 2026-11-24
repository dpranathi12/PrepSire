from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class JAMTopicResponse(BaseModel):
    id: str
    topic_text: str
    category: str
    difficulty: str
    default_prep_seconds: int
    default_speaking_seconds: int
    is_revision: bool = False
    cooldown_active: bool = False

    class Config:
        from_attributes = True

class SubmitJAMRequest(BaseModel):
    topic_id: Optional[str] = None
    topic_text: str
    category: str
    prep_duration_seconds: int = 30
    speaking_duration_seconds: int = 60
    actual_duration_seconds: int = 0
    transcript: str
    response_method: str = "speech"

class JAMSessionResponse(BaseModel):
    id: str
    user_id: str
    topic_id: Optional[str] = None
    topic_text: str
    category: str
    prep_duration_seconds: int
    speaking_duration_seconds: int
    actual_duration_seconds: int
    transcript: str
    response_method: str
    total_score: float
    fluency_score: float
    content_score: float
    vocab_score: float
    grammar_score: float
    confidence_score: float
    time_management_score: float
    filler_count: int
    strengths: List[str] = []
    improvements: List[str] = []
    sample_outline: List[str] = []
    example_opening: Optional[str] = None
    example_closing: Optional[str] = None
    next_steps: List[str] = []
    evaluation_mode: str
    created_at: datetime

    class Config:
        from_attributes = True
