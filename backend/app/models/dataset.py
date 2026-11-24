import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text
from app.db.session import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class DatasetImport(Base):
    __tablename__ = "dataset_imports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    filename = Column(String(255), nullable=False)
    source = Column(String(100), default="interview_forge_v3_complete.csv", nullable=False)
    total_rows = Column(Integer, default=0)
    imported_count = Column(Integer, default=0)
    skipped_count = Column(Integer, default=0)
    duplicate_count = Column(Integer, default=0)
    invalid_count = Column(Integer, default=0)
    status = Column(String(50), default="completed")  # 'running', 'completed', 'failed'
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
