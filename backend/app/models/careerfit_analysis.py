from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON, Float, ForeignKey
from sqlalchemy.sql import func
from app.db.session import Base

class CareerFitAnalysis(Base):
    __tablename__ = "careerfit_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    resume_filename = Column(String(255), nullable=True)
    resume_text = Column(Text, nullable=True)
    
    job_title = Column(String(255), nullable=True, default="Target Role")
    job_desc_text = Column(Text, nullable=True)
    
    # Match Scores
    match_score = Column(Float, nullable=False, default=0.0)
    technical_score = Column(Float, nullable=True, default=0.0)
    soft_skills_score = Column(Float, nullable=True, default=0.0)
    education_score = Column(Float, nullable=True, default=0.0)
    experience_score = Column(Float, nullable=True, default=0.0)
    score_explanation = Column(Text, nullable=True)
    
    # Detailed Categorized Skills
    matching_skills = Column(JSON, nullable=True)  # List of strings or skill objects
    missing_skills = Column(JSON, nullable=True)   # List of strings or skill objects
    improvement_skills = Column(JSON, nullable=True) # List of dicts: {skill, current, expected, what_to_improve, how_to_improve}
    
    # Resume Suggestions
    resume_suggestions = Column(JSON, nullable=True) # List of dicts/strings
    
    # Learning Roadmaps
    roadmap_7_day = Column(JSON, nullable=True)
    roadmap_30_day = Column(JSON, nullable=True)
    
    ocr_pending = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

