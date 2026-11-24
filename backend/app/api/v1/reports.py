import csv
import io
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.db.session import get_db
from app.models.user import User
from app.models.interview import InterviewSession, InterviewQuestion, AnswerEvaluation
from app.models.communication import CommunicationSession
from app.models.jam import JAMSession
from app.models.academic import QuizAttempt
from app.models.coding import CodingSubmission
from app.schemas.reports import (
    SessionComparisonRequest,
    SessionComparisonResponse,
    CriterionDiff,
    SessionSummaryItem
)
from app.api.deps import get_current_user

router = APIRouter(prefix="/reports", tags=["Performance Reports & Comparison"])

@router.get("", response_model=List[SessionSummaryItem])
def list_user_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    items = []

    # Mock Interviews Only (Quizzes, Communication, JAM, and Coding are excluded per user preference)
    for s in db.query(InterviewSession).filter(InterviewSession.user_id == current_user.id).order_by(InterviewSession.created_at.desc()).limit(50):
        items.append(SessionSummaryItem(
            session_id=s.id,
            session_type="mock_interview",
            title=s.title,
            date=s.created_at,
            score=s.overall_score,
            details={"role": s.role, "type": s.interview_type, "status": s.status}
        ))

    items.sort(key=lambda x: x.date, reverse=True)
    return items

@router.get("/{session_type}/{session_id}")
def get_detailed_report(
    session_type: str,
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    st_clean = session_type.lower()
    if st_clean in ["mock_interview", "interview"]:
        session = db.query(InterviewSession).filter(InterviewSession.id == session_id, InterviewSession.user_id == current_user.id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Interview session not found.")
        questions = []
        for q in session.questions:
            questions.append({
                "id": q.id,
                "question_text": q.question_text,
                "category": q.category,
                "user_answer": q.user_answer,
                "evaluation": {
                    "overall_score": q.evaluation.overall_score if q.evaluation else 0,
                    "relevance_score": q.evaluation.relevance_score if q.evaluation else 0,
                    "technical_score": q.evaluation.technical_score if q.evaluation else 0,
                    "clarity_score": q.evaluation.clarity_score if q.evaluation else 0,
                    "communication_score": q.evaluation.communication_score if q.evaluation else 0,
                    "terminology_score": q.evaluation.terminology_score if q.evaluation else 0,
                    "strengths": q.evaluation.strengths if q.evaluation else [],
                    "improvement_suggestions": q.evaluation.improvement_suggestions if q.evaluation else [],
                    "sample_improved_answer": q.evaluation.sample_improved_answer if q.evaluation else None,
                    "filler_count": q.evaluation.filler_count if q.evaluation else 0,
                    "words_per_minute": q.evaluation.words_per_minute if q.evaluation else 0
                } if q.evaluation else None
            })
        return {
            "session_id": session.id,
            "session_type": "mock_interview",
            "candidate_name": current_user.full_name,
            "candidate_email": current_user.email,
            "title": session.title,
            "role": session.role,
            "interview_type": session.interview_type,
            "difficulty": session.difficulty,
            "date": session.created_at.isoformat(),
            "duration": f"{max(5, session.total_questions * 2)} minutes",
            "overall_score": session.overall_score,
            "communication_score": session.communication_score,
            "technical_score": session.technical_score,
            "confidence_score": session.confidence_score,
            "grammar_score": round((session.communication_score * 0.95), 1),
            "vocabulary_score": round((session.technical_score * 0.95), 1),
            "strengths": session.strengths or ["Clear logical reasoning", "Direct structure"],
            "weaknesses": session.weaknesses or ["Expand further on edge cases and scale constraints"],
            "recommended_topics": session.recommended_topics,
            "action_plan": session.action_plan or [
                "Practice 60-second elevator pitch drill daily",
                "Review time and space complexity tradeoffs",
                "Incorporate STAR framing in behavioral answers"
            ],
            "questions": questions
        }

    elif session_type == "communication":
        comm = db.query(CommunicationSession).filter(CommunicationSession.id == session_id, CommunicationSession.user_id == current_user.id).first()
        if not comm:
            raise HTTPException(status_code=404, detail="Communication session not found.")
        return {
            "session_id": comm.id,
            "session_type": "communication",
            "title": f"Communication: {comm.category}",
            "prompt_text": comm.prompt_text,
            "response_text": comm.response_text,
            "date": comm.created_at.isoformat(),
            "overall_score": comm.overall_score,
            "relevance_score": comm.relevance_score,
            "clarity_score": comm.clarity_score,
            "structure_score": comm.structure_score,
            "grammar_score": comm.grammar_score,
            "vocabulary_score": comm.vocabulary_score,
            "conciseness_score": comm.conciseness_score,
            "filler_count": comm.filler_count,
            "words_per_minute": comm.words_per_minute,
            "strengths": comm.strengths,
            "weaknesses": comm.weaknesses,
            "alternative_expressions": comm.alternative_expressions,
            "improved_sample_answer": comm.improved_sample_answer,
            "next_step_recommendation": comm.next_step_recommendation
        }

    elif session_type == "jam":
        jam = db.query(JAMSession).filter(JAMSession.id == session_id, JAMSession.user_id == current_user.id).first()
        if not jam:
            raise HTTPException(status_code=404, detail="JAM session not found.")
        return {
            "session_id": jam.id,
            "session_type": "jam",
            "title": f"JAM: {jam.topic_text}",
            "topic_text": jam.topic_text,
            "transcript": jam.transcript,
            "date": jam.created_at.isoformat(),
            "total_score": jam.total_score,
            "fluency_score": jam.fluency_score,
            "content_score": jam.content_score,
            "vocab_score": jam.vocab_score,
            "grammar_score": jam.grammar_score,
            "confidence_score": jam.confidence_score,
            "time_management_score": jam.time_management_score,
            "filler_count": jam.filler_count,
            "strengths": jam.strengths,
            "improvements": jam.improvements,
            "sample_outline": jam.sample_outline,
            "example_opening": jam.example_opening,
            "example_closing": jam.example_closing
        }

    elif session_type == "quiz":
        quiz = db.query(QuizAttempt).filter(QuizAttempt.id == session_id, QuizAttempt.user_id == current_user.id).first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz attempt not found.")
        return {
            "session_id": quiz.id,
            "session_type": "quiz",
            "title": f"Quiz: {quiz.subject}",
            "subject": quiz.subject,
            "score": quiz.score,
            "total_questions": quiz.total_questions,
            "correct_count": quiz.correct_count,
            "answers_detail": quiz.answers_detail,
            "date": quiz.created_at.isoformat()
        }

    raise HTTPException(status_code=400, detail="Unsupported session type.")

@router.post("/compare", response_model=SessionComparisonResponse)
def compare_two_sessions(
    comp_in: SessionComparisonRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    req_type = comp_in.session_type.lower()
    if req_type in ["interview", "mock_interview"]:
        s1 = db.query(InterviewSession).filter(InterviewSession.id == comp_in.session_id_1, InterviewSession.user_id == current_user.id).first()
        s2 = db.query(InterviewSession).filter(InterviewSession.id == comp_in.session_id_2, InterviewSession.user_id == current_user.id).first()
        if not s1 or not s2:
            raise HTTPException(status_code=404, detail="One or both interview sessions not found.")

        # Ensure s1 is earlier and s2 is later
        if s1.created_at > s2.created_at:
            s1, s2 = s2, s1

        diff_pts = round(s2.overall_score - s1.overall_score, 1)
        is_approx = (s1.role != s2.role or s1.difficulty != s2.difficulty)

        criterion_diffs = [
            CriterionDiff(criterion="Overall Score", session_1_score=s1.overall_score, session_2_score=s2.overall_score, difference=diff_pts),
            CriterionDiff(criterion="Technical Knowledge", session_1_score=s1.technical_score, session_2_score=s2.technical_score, difference=round(s2.technical_score - s1.technical_score, 1)),
            CriterionDiff(criterion="Communication Clarity", session_1_score=s1.communication_score, session_2_score=s2.communication_score, difference=round(s2.communication_score - s1.communication_score, 1)),
            CriterionDiff(criterion="Confidence & Pacing", session_1_score=s1.confidence_score, session_2_score=s2.confidence_score, difference=round(s2.confidence_score - s1.confidence_score, 1))
        ]

        skills_improved = []
        if s2.communication_score > s1.communication_score:
            skills_improved.append("Articulated responses with greater clarity and fewer hesitations.")
        if s2.technical_score > s1.technical_score:
            skills_improved.append("Demonstrated stronger technical terminology and algorithmic depth.")
        if not skills_improved:
            skills_improved.append("Maintained consistent baseline engagement.")

        persistent_weaknesses = list(set(s1.weaknesses or []).intersection(set(s2.weaknesses or [])))
        if not persistent_weaknesses:
            persistent_weaknesses = ["Continue expanding on concrete production constraints and trade-offs."]

        return SessionComparisonResponse(
            session_type="interview",
            session_1_id=s1.id,
            session_2_id=s2.id,
            session_1_date=s1.created_at.strftime("%Y-%m-%d %H:%M"),
            session_2_date=s2.created_at.strftime("%Y-%m-%d %H:%M"),
            score_1=s1.overall_score,
            score_2=s2.overall_score,
            point_difference=diff_pts,
            is_approximate_comparison=is_approx,
            criterion_differences=criterion_diffs,
            skills_improved=skills_improved,
            persistent_weaknesses=persistent_weaknesses,
            recommended_next_activities=[
                "Focus on the persistent weaknesses in your next targeted 30-day plan task.",
                "Conduct a 60-second elevator pitch drill addressing trade-offs explicitly."
            ]
        )

    elif comp_in.session_type in ["communication", "jam"]:
        # Communication or JAM comparison
        model_cls = CommunicationSession if comp_in.session_type == "communication" else JAMSession
        s1 = db.query(model_cls).filter(model_cls.id == comp_in.session_id_1, model_cls.user_id == current_user.id).first()
        s2 = db.query(model_cls).filter(model_cls.id == comp_in.session_id_2, model_cls.user_id == current_user.id).first()
        if not s1 or not s2:
            raise HTTPException(status_code=404, detail="One or both sessions not found.")

        if s1.created_at > s2.created_at:
            s1, s2 = s2, s1

        score_attr = "overall_score" if comp_in.session_type == "communication" else "total_score"
        sc1 = getattr(s1, score_attr)
        sc2 = getattr(s2, score_attr)
        diff_pts = round(sc2 - sc1, 1)

        criterion_diffs = [
            CriterionDiff(criterion="Total Score", session_1_score=sc1, session_2_score=sc2, difference=diff_pts),
            CriterionDiff(criterion="Filler Word Count", session_1_score=float(s1.filler_count), session_2_score=float(s2.filler_count), difference=float(s2.filler_count - s1.filler_count))
        ]

        skills_improved = []
        if s2.filler_count < s1.filler_count:
            skills_improved.append(f"Reduced filler words from {s1.filler_count} down to {s2.filler_count}.")
        if sc2 > sc1:
            skills_improved.append("Improved overall articulation and coherence under time constraints.")
        if not skills_improved:
            skills_improved.append("Showed consistent spontaneous speaking delivery.")

        return SessionComparisonResponse(
            session_type=comp_in.session_type,
            session_1_id=s1.id,
            session_2_id=s2.id,
            session_1_date=s1.created_at.strftime("%Y-%m-%d %H:%M"),
            session_2_date=s2.created_at.strftime("%Y-%m-%d %H:%M"),
            score_1=sc1,
            score_2=sc2,
            point_difference=diff_pts,
            is_approximate_comparison=True,
            criterion_differences=criterion_diffs,
            skills_improved=skills_improved,
            persistent_weaknesses=["Eliminate residual filler sounds during impromptu opening sentences."],
            recommended_next_activities=["Practice pausing silently for 2 seconds when starting a new paragraph."]
        )

    raise HTTPException(status_code=400, detail="Unsupported session comparison type.")

@router.get("/{session_type}/{session_id}/export-csv")
def export_session_csv(
    session_type: str,
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    output = io.StringIO()
    writer = csv.writer(output)

    if session_type == "mock_interview":
        session = db.query(InterviewSession).filter(InterviewSession.id == session_id, InterviewSession.user_id == current_user.id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found.")
        writer.writerow(["PrepSpire AI Interview Feedback Report"])
        writer.writerow(["Title", session.title])
        writer.writerow(["Role", session.role])
        writer.writerow(["Type", session.interview_type])
        writer.writerow(["Date", session.created_at.isoformat()])
        writer.writerow(["Overall Score", session.overall_score])
        writer.writerow(["Technical Score", session.technical_score])
        writer.writerow(["Communication Score", session.communication_score])
        writer.writerow(["Confidence Score", session.confidence_score])
        writer.writerow([])
        writer.writerow(["Question #", "Question Text", "Category", "Candidate Answer", "Score", "Improvement Suggestion"])
        for idx, q in enumerate(session.questions, 1):
            eval_score = q.evaluation.overall_score if q.evaluation else "N/A"
            sugg = "; ".join(q.evaluation.improvement_suggestions or []) if q.evaluation else ""
            writer.writerow([idx, q.question_text, q.category, q.user_answer or "", eval_score, sugg])

    else:
        writer.writerow(["Session Export", session_type, session_id])
        writer.writerow(["User", current_user.email])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=prepspire_{session_type}_{session_id[:8]}.csv"}
    )
