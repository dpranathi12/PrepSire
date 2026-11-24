from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class AcademicQuestionResponse(BaseModel):
    id: str
    subject: str
    topic: str
    difficulty: str
    question_type: str
    question_text: str
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None  # Included after submission or in practice mode
    explanation: Optional[str] = None

    class Config:
        from_attributes = True

class QuizAnswerItem(BaseModel):
    question_id: str
    user_answer: str

class SubmitQuizRequest(BaseModel):
    subject: str
    topic: Optional[str] = None
    answers: List[QuizAnswerItem]
    time_taken_seconds: int = 0

class QuizAnswerDetail(BaseModel):
    question_id: str
    question_text: str
    user_answer: str
    correct_answer: str
    is_correct: bool
    explanation: str

class QuizAttemptResponse(BaseModel):
    id: str
    user_id: str
    subject: str
    topic: Optional[str] = None
    score: float
    total_questions: int
    correct_count: int
    answers_detail: List[QuizAnswerDetail] = []
    time_taken_seconds: int
    created_at: datetime

    class Config:
        from_attributes = True
