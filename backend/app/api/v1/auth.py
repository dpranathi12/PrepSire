from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.user import User, UserProfile, UserPreferences
from app.schemas.user import UserCreate, UserLogin, Token, UserResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    clean_email = user_in.email.strip().lower()
    clean_name = user_in.full_name.strip()

    if len(clean_name) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Full name must be at least 2 characters long."
        )

    if len(user_in.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long."
        )

    # Check if user exists
    existing = db.query(User).filter(User.email == clean_email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please sign in instead."
        )

    # Create User
    new_user = User(
        email=clean_email,
        hashed_password=get_password_hash(user_in.password),
        full_name=clean_name
    )
    db.add(new_user)
    db.flush()

    # Create default profile and preferences
    profile = UserProfile(
        user_id=new_user.id,
        display_name=new_user.full_name,
        target_role="Software Developer",
        experience_level="Beginner",
        known_skills=["Python", "SQL", "HTML/CSS"],
        target_skills=["DSA", "React", "System Design"],
        is_onboarded=False
    )
    preferences = UserPreferences(
        user_id=new_user.id,
        theme="dark",
        ai_mode="offline"
    )
    db.add(profile)
    db.add(preferences)
    db.commit()

    token = create_access_token(new_user.id)
    return Token(
        access_token=token,
        token_type="bearer",
        user_id=new_user.id,
        email=new_user.email,
        full_name=new_user.full_name
    )

@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    clean_email = login_in.email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password. Please verify your credentials.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This account has been deactivated. Please contact support.")

    token = create_access_token(user.id)
    return Token(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        full_name=user.full_name
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
