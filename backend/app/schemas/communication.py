from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CommunicationPromptResponse(BaseModel):
    id: str
    category: str
    difficulty: str
    prompt_text: str
    prep_time_seconds: int
    speaking_time_seconds: int
    tags: List[str] = []

    class Config:
        from_attributes = True

class SubmitCommunicationRequest(BaseModel):
    prompt_id: Optional[str] = None
    category: str
    prompt_text: str
    prep_time_seconds: int = 30
    response_duration_seconds: int = 120
    actual_duration_seconds: int = 0
    response_text: str
    response_method: str = "typed"  # 'typed' or 'speech'

class CommunicationSessionResponse(BaseModel):
    id: str
    user_id: str
    prompt_id: Optional[str] = None
    category: str
    difficulty: str
    prompt_text: str
    prep_time_seconds: int
    response_duration_seconds: int
    actual_duration_seconds: int
    response_text: str
    response_method: str
    overall_score: float
    relevance_score: float
    clarity_score: float
    structure_score: float
    grammar_score: float
    vocabulary_score: float
    conciseness_score: float
    filler_words: List[str] = []
    filler_count: int
    words_per_minute: float
    strengths: List[str] = []
    weaknesses: List[str] = []
    alternative_expressions: List[str] = []
    improved_sample_answer: Optional[str] = None
    next_step_recommendation: Optional[str] = None
    evaluation_mode: str
    created_at: datetime

    class Config:
        from_attributes = True
