from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class QuestionResponse(BaseModel):
    id: str
    question_text: str
    keywords: List[str] = []
    role: str
    sector: Optional[str] = None
    interview_stage: Optional[str] = None
    interviewer: Optional[str] = None
    question_category: Optional[str] = None
    question_level: Optional[str] = None
    source: str

    class Config:
        from_attributes = True

class QuestionSearchQuery(BaseModel):
    role: Optional[str] = None
    category: Optional[str] = None
    level: Optional[str] = None
    stage: Optional[str] = None
    query: Optional[str] = None
    limit: int = 20
    offset: int = 0

class InterviewCreate(BaseModel):
    title: Optional[str] = None
    role: str = "Software Developer"
    interview_type: str = "Mixed"  # 'HR', 'Technical', 'Behavioral', 'Mixed'
    difficulty: str = "Medium"
    interview_stage: Optional[str] = "Stage 2: Technical Assessment"
    total_questions: int = 5
    ai_provider: Optional[str] = "offline"

class SubmitAnswerRequest(BaseModel):
    interview_question_id: str
    user_answer: str
    answer_method: str = "typed"  # 'typed' or 'speech'
    duration_seconds: int = 60

class AnswerEvaluationResponse(BaseModel):
    id: str
    overall_score: float
    relevance_score: float
    technical_score: float
    clarity_score: float
    structure_score: float
    communication_score: float
    terminology_score: float
    strengths: List[str] = []
    missing_concepts: List[str] = []
    improvement_suggestions: List[str] = []
    sample_improved_answer: Optional[str] = None
    star_method_used: bool = False
    filler_words: List[str] = []
    filler_count: int = 0
    words_per_minute: float = 0.0
    evaluation_mode: str = "offline"
    follow_up_question: Optional[str] = None

    class Config:
        from_attributes = True

class InterviewQuestionResponse(BaseModel):
    id: str
    question_text: str
    category: str
    difficulty: str
    order_index: int
    is_follow_up: bool
    user_answer: Optional[str] = None
    answer_method: Optional[str] = "typed"
    evaluation: Optional[AnswerEvaluationResponse] = None

    class Config:
        from_attributes = True

class InterviewSessionResponse(BaseModel):
    id: str
    user_id: str
    title: str
    role: str
    interview_type: str
    difficulty: str
    interview_stage: Optional[str] = None
    total_questions: int
    status: str
    overall_score: float
    communication_score: float
    technical_score: float
    confidence_score: float
    strengths: List[str] = []
    weaknesses: List[str] = []
    recommended_topics: List[str] = []
    action_plan: List[str] = []
    ai_provider: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class InterviewSessionDetailResponse(InterviewSessionResponse):
    questions: List[InterviewQuestionResponse] = []
