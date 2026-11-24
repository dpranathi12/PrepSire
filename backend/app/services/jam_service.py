import random
from datetime import datetime, timedelta
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from app.models.jam import JAMTopic, JAMSession

def get_next_jam_topic(
    db: Session,
    user_id: str,
    category: Optional[str] = None,
    allow_retry_id: Optional[str] = None,
    exclude_id: Optional[str] = None,
    cooldown_days: int = 30
) -> Tuple[JAMTopic, bool, bool]:
    """
    Returns: (topic, is_revision_mode, cooldown_active)
    """
    # 1. If user explicitly requested a specific retry topic:
    if allow_retry_id:
        topic = db.query(JAMTopic).filter(JAMTopic.id == allow_retry_id).first()
        if topic:
            return topic, True, False

    query = db.query(JAMTopic)
    if category and category.lower() not in ["all", "all categories"]:
        query = query.filter(JAMTopic.category.ilike(f"%{category}%"))
    
    all_topics = query.all()
    if not all_topics:
        # Fallback to any topic
        all_topics = db.query(JAMTopic).all()
        if not all_topics:
            raise ValueError("No JAM topics found in database.")

    # 2. Query user's session history
    recent_cutoff = datetime.utcnow() - timedelta(days=cooldown_days)
    user_sessions = (
        db.query(JAMSession)
        .filter(JAMSession.user_id == user_id)
        .order_by(JAMSession.created_at.desc())
        .all()
    )

    # Prevent consecutive repeat
    last_topic_id = user_sessions[0].topic_id if user_sessions else None
    
    seen_topic_ids = {s.topic_id for s in user_sessions if s.topic_id}
    recent_topic_ids = {
        s.topic_id for s in user_sessions 
        if s.topic_id and s.created_at >= recent_cutoff
    }

    # Filter out exclude_id and consecutive last topic if more than 1 topic exists
    def filter_available(topics_list):
        filtered = [t for t in topics_list if t.id != exclude_id and t.id != last_topic_id]
        if not filtered and topics_list:
            filtered = [t for t in topics_list if t.id != exclude_id]
        return filtered or topics_list

    # 3. Prefer completely unseen topics
    unseen = filter_available([t for t in all_topics if t.id not in seen_topic_ids])
    if unseen:
        return random.choice(unseen), False, False

    # 4. If all topics seen, prefer topics whose cooldown period has passed (> 30 days)
    off_cooldown = filter_available([t for t in all_topics if t.id not in recent_topic_ids])
    if off_cooldown:
        return random.choice(off_cooldown), True, False

    # 5. All topics are on active cooldown -> Revision Mode
    # Pick randomly among available topics excluding the immediate prior
    candidates = filter_available(all_topics)
    selected = random.choice(candidates) if candidates else all_topics[0]
    return selected, True, True
