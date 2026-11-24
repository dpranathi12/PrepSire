from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User, UserProfile
from app.models.learning_plan import LearningPlan, DailyPlanTask
from app.schemas.user import UserProfileUpdate, UserProfileResponse
from app.api.deps import get_current_user
from app.services.learning_planner import generate_30_day_tasks

router = APIRouter(prefix="/profile", tags=["Profile & Onboarding"])

@router.get("", response_model=UserProfileResponse)
def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        profile = UserProfile(user_id=current_user.id, display_name=current_user.full_name)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("", response_model=UserProfileResponse)
def update_user_profile(
    profile_in: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)

    update_data = profile_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)
    profile.is_onboarded = True
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/diagnostic-assessment")
def submit_diagnostic_assessment(
    assessment_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Calculate baseline diagnostic score from inputs
    intro_length = len(str(assessment_data.get("selfIntro", "")).split())
    tech_ans = str(assessment_data.get("technicalAnswer", "")).strip()
    problem_ans = str(assessment_data.get("problemSolvingAnswer", "")).strip()
    behavioral_ans = str(assessment_data.get("behavioralAnswer", "")).strip()

    comm_score = min(92.0, 50.0 + (intro_length * 0.8))
    tech_score = 75.0 if len(tech_ans) > 20 else 50.0
    problem_score = 78.0 if len(problem_ans) > 20 else 52.0
    behavioral_score = 72.0 if len(behavioral_ans) > 20 else 48.0
    overall = round((comm_score + tech_score + problem_score + behavioral_score) / 4.0, 1)

    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if profile:
        profile.is_onboarded = True
        db.commit()

    # Generate or update learning plan in database
    existing_plan = db.query(LearningPlan).filter(LearningPlan.user_id == current_user.id, LearningPlan.active == True).first()
    if not existing_plan:
        new_plan = LearningPlan(
            user_id=current_user.id,
            target_role=profile.target_role if profile else "Software Developer",
            daily_time_budget_minutes=profile.daily_prep_time_minutes if profile else 60,
            baseline_score=overall,
            current_readiness_score=overall,
            active=True
        )
        db.add(new_plan)
        db.flush()

        task_dicts = generate_30_day_tasks(
            target_role=new_plan.target_role,
            daily_budget_minutes=new_plan.daily_time_budget_minutes,
            baseline_score=overall
        )
        for td in task_dicts:
            task_obj = DailyPlanTask(
                plan_id=new_plan.id,
                day_number=td["day_number"],
                week_number=td["week_number"],
                phase=td["phase"],
                task_type=td["task_type"],
                title=td["title"],
                instructions=td["instructions"],
                estimated_minutes=td["estimated_minutes"],
                difficulty=td["difficulty"],
                status="pending",
                recommendation_reason=td["recommendation_reason"],
                module_link=td["module_link"]
            )
            db.add(task_obj)
        db.commit()

    return {
        "baseline_score": overall,
        "communication_score": round(comm_score, 1),
        "technical_score": round(tech_score, 1),
        "problem_solving_score": round(problem_score, 1),
        "behavioral_score": round(behavioral_score, 1),
        "strengths": [
            "Clear technical orientation",
            "Structured response delivery",
            "High readiness for core algorithmic preparation"
        ],
        "weaknesses": [
            "Needs more concrete trade-off articulation in behavioral scenarios",
            "Vocabulary precision can be further refined"
        ],
        "recommended_difficulty": "Medium",
        "message": "Baseline diagnostic assessment complete. Your personalized 30-Day Placement Plan is active in the database."
    }
