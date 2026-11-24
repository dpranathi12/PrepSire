import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app as fastapi_app
from app.db.session import Base, get_db
import app.models
from app.db.init_db import init_db

TEST_DB_URL = "sqlite:///./test_prepspire.db"
test_engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    # Initialize seeds
    db = TestingSessionLocal()
    from app.models.question import Question
    from app.models.gamification import Badge
    from app.models.jam import JAMTopic
    from app.models.communication import CommunicationPrompt
    from app.models.academic import AcademicQuestion
    from app.models.coding import CodingChallenge
    from app.db.init_db import (
        INITIAL_BADGES,
        INITIAL_JAM_TOPICS,
        INITIAL_COMMUNICATION_PROMPTS,
        INITIAL_ACADEMIC_QUESTIONS,
        INITIAL_CODING_CHALLENGES
    )
    for b in INITIAL_BADGES:
        db.add(Badge(**b))
    for t in INITIAL_JAM_TOPICS:
        db.add(JAMTopic(**t))
    for p in INITIAL_COMMUNICATION_PROMPTS:
        db.add(CommunicationPrompt(**p))
    for a in INITIAL_ACADEMIC_QUESTIONS:
        db.add(AcademicQuestion(**a))
    for c in INITIAL_CODING_CHALLENGES:
        db.add(CodingChallenge(**c))

    # Seed test questions
    for i in range(1, 10):
        q = Question(
            id=f"test-q-{i}",
            question_text=f"Explain concept {i} in software engineering and discuss latency trade-offs.",
            normalized_question=f"explain concept {i} in software engineering and discuss latency trade-offs.",
            role="Software Developer",
            sector="Technology",
            interview_stage="Stage 2: Technical Assessment",
            question_category="Technical",
            question_level="Medium",
            source="test_seed"
        )
        db.add(q)
    db.commit()
    db.close()
    yield
    Base.metadata.drop_all(bind=test_engine)
    if os.path.exists("./test_prepspire.db"):
        try:
            os.remove("./test_prepspire.db")
        except Exception:
            pass

@pytest.fixture
def db_session():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()

@pytest.fixture
def client():
    def override_get_db():
        session = TestingSessionLocal()
        try:
            yield session
        finally:
            session.close()

    fastapi_app.dependency_overrides[get_db] = override_get_db
    with TestClient(fastapi_app) as test_client:
        yield test_client
    fastapi_app.dependency_overrides.clear()
