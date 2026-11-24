from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.session import get_db
from app.models.user import User, UserProfile
from app.models.learning_plan import LearningPlan, DailyPlanTask
from app.schemas.learning_plan import LearningPlanResponse, GeneratePlanRequest, DailyPlanTaskResponse
from app.api.deps import get_current_user
from app.services.learning_planner import generate_30_day_tasks

router = APIRouter(prefix="/learning-plan", tags=["30-Day Placement Plan"])

@router.get("", response_model=LearningPlanResponse)
def get_active_learning_plan(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    plan = (
        db.query(LearningPlan)
        .filter(LearningPlan.user_id == current_user.id, LearningPlan.active == True)
        .first()
    )
    if not plan:
        # Auto-create active plan for user
        profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
        role = profile.target_role if profile else "Software Developer"
        budget = profile.daily_prep_time_minutes if profile else 60

        plan = LearningPlan(
            user_id=current_user.id,
            target_role=role,
            daily_time_budget_minutes=budget,
            baseline_score=55.0,
            current_readiness_score=55.0,
            active=True
        )
        db.add(plan)
        db.flush()

        task_dicts = generate_30_day_tasks(target_role=role, daily_budget_minutes=budget)
        for td in task_dicts:
            task = DailyPlanTask(
                plan_id=plan.id,
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
            db.add(task)
        db.commit()
        db.refresh(plan)

    return plan

@router.post("/generate", response_model=LearningPlanResponse)
def generate_or_regenerate_plan(
    gen_in: GeneratePlanRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    role = gen_in.target_role or (profile.target_role if profile else "Software Developer")
    budget = gen_in.daily_prep_time_minutes or (profile.daily_prep_time_minutes if profile else 60)

    existing_plan = (
        db.query(LearningPlan)
        .filter(LearningPlan.user_id == current_user.id, LearningPlan.active == True)
        .first()
    )

    if existing_plan and not gen_in.regenerate:
        return existing_plan

    if existing_plan and gen_in.regenerate:
        # Preserve completed tasks, regenerate pending future tasks
        completed_task_ids = {t.id for t in existing_plan.tasks if t.status == "completed"}
        db.query(DailyPlanTask).filter(
            DailyPlanTask.plan_id == existing_plan.id,
            DailyPlanTask.status == "pending"
        ).delete()
        
        task_dicts = generate_30_day_tasks(target_role=role, daily_budget_minutes=budget)
        for td in task_dicts:
            # Add pending task
            task = DailyPlanTask(
                plan_id=existing_plan.id,
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
            db.add(task)
        existing_plan.target_role = role
        existing_plan.daily_time_budget_minutes = budget
        db.commit()
        db.refresh(existing_plan)
        return existing_plan

    # Brand new plan
    new_plan = LearningPlan(
        user_id=current_user.id,
        target_role=role,
        daily_time_budget_minutes=budget,
        active=True
    )
    db.add(new_plan)
    db.flush()

    task_dicts = generate_30_day_tasks(target_role=role, daily_budget_minutes=budget)
    for td in task_dicts:
        task = DailyPlanTask(
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
        db.add(task)

    db.commit()
    db.refresh(new_plan)
    return new_plan

@router.put("/tasks/{task_id}/toggle", response_model=DailyPlanTaskResponse)
def toggle_task_status(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = (
        db.query(DailyPlanTask)
        .join(LearningPlan, DailyPlanTask.plan_id == LearningPlan.id)
        .filter(DailyPlanTask.id == task_id, LearningPlan.user_id == current_user.id)
        .first()
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or unauthorized.")

    if task.status == "completed":
        task.status = "pending"
        task.completed_at = None
    else:
        task.status = "completed"
        task.completed_at = datetime.utcnow()

    # Recalculate completed days
    plan = db.query(LearningPlan).filter(LearningPlan.id == task.plan_id).first()
    if plan:
        completed_days_count = len(set(
            t.day_number for t in plan.tasks if t.status == "completed"
        ))
        plan.completed_days = completed_days_count
        plan.current_readiness_score = min(98.0, 50.0 + (completed_days_count * 1.6))

    db.commit()
    db.refresh(task)
    return task
