import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class Badge(Base):
    __tablename__ = "badges"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(50), default="🏆")
    category = Column(String(100), default="General")
    xp_reward = Column(Integer, default=50)
    condition_type = Column(String(100), nullable=False)  # 'first_interview', 'streak_7', 'jam_5', 'coding_10', etc.
    condition_value = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    badge_id = Column(String(36), ForeignKey("badges.id", ondelete="CASCADE"), nullable=False, index=True)
    unlocked_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "badge_id", name="uq_user_badge"),
    )

    user = relationship("User", back_populates="achievements")
    badge = relationship("Badge")
