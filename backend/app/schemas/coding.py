from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class CodingChallengeResponse(BaseModel):
    id: str
    title: str
    slug: str
    difficulty: str
    topic: str
    problem_statement: str
    constraints: List[str] = []
    input_format: Optional[str] = None
    output_format: Optional[str] = None
    sample_test_cases: List[Dict[str, Any]] = []
    starter_code: Dict[str, str] = {}
    hints: List[str] = []
    expected_approach: Optional[str] = None
    explanation: Optional[str] = None

    class Config:
        from_attributes = True

class SubmitCodingRequest(BaseModel):
    challenge_id: str
    language: str = "python"
    code: str

class RunCodeResponse(BaseModel):
    status: str
    passed_count: int
    total_test_cases: int
    execution_time_ms: float
    execution_mode: str
    feedback: str
    test_results: List[Dict[str, Any]] = []

class CodingSubmissionResponse(BaseModel):
    id: str
    user_id: str
    challenge_id: str
    language: str
    code: str
    status: str  # 'passed', 'failed', 'practice_submitted', 'syntax_error'
    passed_count: int
    total_test_cases: int
    execution_mode: str  # 'real_execution' or 'practice_mode'
    execution_time_ms: float
    feedback: Optional[str] = None
    test_results: Optional[List[Dict[str, Any]]] = None
    created_at: datetime

    class Config:
        from_attributes = True
