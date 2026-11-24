from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.db.session import get_db
from app.models.user import User, UserProfile
from app.models.interview import InterviewSession, AnswerAttempt
from app.models.communication import CommunicationSession
from app.models.jam import JAMSession
from app.models.academic import QuizAttempt
from app.models.coding import CodingSubmission
from app.models.gamification import Badge, UserAchievement
from app.models.learning_plan import LearningPlan, DailyPlanTask
from app.api.deps import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Progress & Analytics Dashboard"])

@router.get("/stats")
def get_dashboard_statistics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Real database counts
    mock_count = db.query(InterviewSession).filter(
        InterviewSession.user_id == current_user.id,
        InterviewSession.status == "completed"
    ).count()

    questions_count = db.query(AnswerAttempt).filter(
        AnswerAttempt.user_id == current_user.id
    ).count()

    jam_count = db.query(JAMSession).filter(
        JAMSession.user_id == current_user.id
    ).count()

    comm_count = db.query(CommunicationSession).filter(
        CommunicationSession.user_id == current_user.id
    ).count()

    coding_count = db.query(CodingSubmission).filter(
        CodingSubmission.user_id == current_user.id
    ).count()

    quiz_count = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id
    ).count()

    # Calculate average scores from completed sessions
    mock_sessions = db.query(InterviewSession).filter(
        InterviewSession.user_id == current_user.id,
        InterviewSession.status == "completed"
    ).all()
    avg_mock_score = (
        round(sum(s.overall_score for s in mock_sessions) / len(mock_sessions), 1)
        if mock_sessions else 0.0
    )

    comm_sessions = db.query(CommunicationSession).filter(
        CommunicationSession.user_id == current_user.id
    ).all()
    avg_comm_score = (
        round(sum(s.overall_score for s in comm_sessions) / len(comm_sessions), 1)
        if comm_sessions else 0.0
    )

    jam_sessions = db.query(JAMSession).filter(
        JAMSession.user_id == current_user.id
    ).all()
    avg_jam_score = (
        round(sum(s.total_score for s in jam_sessions) / len(jam_sessions), 1)
        if jam_sessions else 0.0
    )

    quiz_attempts = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id
    ).all()
    avg_quiz_score = (
        round(sum(q.score for q in quiz_attempts) / len(quiz_attempts), 1)
        if quiz_attempts else 0.0
    )

    # Composite Skill Scores
    scores_pool = []
    if avg_mock_score > 0: scores_pool.append(avg_mock_score)
    if avg_comm_score > 0: scores_pool.append(avg_comm_score)
    if avg_jam_score > 0: scores_pool.append(avg_jam_score)
    if avg_quiz_score > 0: scores_pool.append(avg_quiz_score)

    overall_readiness = round(sum(scores_pool) / len(scores_pool), 1) if scores_pool else 0.0
    comm_score = max(avg_comm_score, avg_jam_score) if (avg_comm_score or avg_jam_score) else 0.0
    tech_score = max(avg_mock_score, avg_quiz_score) if (avg_mock_score or avg_quiz_score) else 0.0
    confidence_score = avg_jam_score if avg_jam_score else (avg_mock_score if avg_mock_score else 0.0)
    grammar_score = round((avg_comm_score * 0.5 + avg_jam_score * 0.5), 1) if (avg_comm_score and avg_jam_score) else max(avg_comm_score, avg_jam_score)
    problem_solving = avg_quiz_score if avg_quiz_score else (75.0 if coding_count > 0 else 0.0)

    # XP Calculation: 100 per interview, 50 per comm, 40 per JAM, 30 per quiz, 40 per coding
    total_xp = (mock_count * 100) + (comm_count * 50) + (jam_count * 40) + (quiz_count * 30) + (coding_count * 40)
    level = max(1, (total_xp // 200) + 1)
    streak = 1 if (mock_count + comm_count + jam_count + coding_count + quiz_count) > 0 else 0

    # Unlocked badges from UserAchievement
    all_badges = db.query(Badge).all()
    unlocked_achievement_ids = set(
        a.badge_id for a in db.query(UserAchievement).filter(UserAchievement.user_id == current_user.id).all()
    )
    badge_list = []
    for b in all_badges:
        badge_list.append({
            "id": b.id,
            "title": b.title,
            "description": b.description,
            "icon": b.icon,
            "unlocked": b.id in unlocked_achievement_ids,
            "category": b.category
        })

    # Weekly Progression Data for Recharts
    weekly_progression = [
        {"week": "Week 1", "score": min(100.0, max(20.0, overall_readiness - 15.0)) if overall_readiness > 0 else 0},
        {"week": "Week 2", "score": min(100.0, max(25.0, overall_readiness - 8.0)) if overall_readiness > 0 else 0},
        {"week": "Week 3", "score": min(100.0, max(30.0, overall_readiness - 3.0)) if overall_readiness > 0 else 0},
        {"week": "Week 4", "score": overall_readiness}
    ]

    # Learning plan summary
    plan = db.query(LearningPlan).filter(LearningPlan.user_id == current_user.id, LearningPlan.active == True).first()
    plan_completed_tasks = 0
    total_tasks = 0
    if plan:
        plan_completed_tasks = db.query(DailyPlanTask).filter(DailyPlanTask.plan_id == plan.id, DailyPlanTask.status == "completed").count()
        total_tasks = db.query(DailyPlanTask).filter(DailyPlanTask.plan_id == plan.id).count()

    return {
        "gamification": {
            "xp": total_xp,
            "level": level,
            "streak": streak,
            "lastActiveDate": datetime.utcnow().strftime("%Y-%m-%d"),
            "badges": badge_list,
            "questionsAnswered": questions_count,
            "mockInterviewsCompleted": mock_count,
            "jamCompleted": jam_count,
            "communicationCompleted": comm_count,
            "codingCompleted": coding_count,
            "quizzesCompleted": quiz_count
        },
        "scores": {
            "overall": overall_readiness,
            "communication": comm_score,
            "technical": tech_score,
            "confidence": confidence_score,
            "grammar": grammar_score,
            "problemSolving": problem_solving
        },
        "averages": {
            "mock_interview": avg_mock_score,
            "communication": avg_comm_score,
            "jam": avg_jam_score,
            "academic": avg_quiz_score
        },
        "weeklyProgress": weekly_progression,
        "strongest_subject": "Technical Practice" if tech_score >= comm_score else "Communication",
        "weakest_subject": "System Design & Conflict Resolution" if comm_score < tech_score else "Data Structures & Algorithms",
        "learning_plan_progress": {
            "completed_tasks": plan_completed_tasks,
            "total_tasks": total_tasks,
            "percentage": round((plan_completed_tasks / total_tasks * 100), 1) if total_tasks > 0 else 0
        }
    }
