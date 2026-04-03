from fastapi import APIRouter, Depends, HTTPException
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime, timezone

from database import models, schemas
from database.database import get_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    normalized_username = user.username.strip()
    normalized_email = user.email.strip().lower()
    hashed_password = pwd_context.hash(user.password)
    
    # Check if user exists
    existing_user = db.query(models.User).filter(models.User.email == normalized_email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    existing_username = db.query(models.User).filter(models.User.username == normalized_username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already registered")

    db_user = models.User(username=normalized_username, email=normalized_email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=schemas.User)
def login_user(user_login: schemas.UserLogin, db: Session = Depends(get_db)):
    normalized_email = user_login.email.strip().lower()
    user = db.query(models.User).filter(models.User.email == normalized_email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    if not pwd_context.verify(user_login.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")       
    return user

@router.get("/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/{user_id}/progress", response_model=schemas.UserProgress)
def add_user_progress(user_id: int, progress: schemas.UserProgressCreate, db: Session = Depends(get_db)):
    # Verify user exists
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
         raise HTTPException(status_code=404, detail="User not found")
        
    db_progress = models.UserProgress(**progress.dict(), user_id=user_id)
    db.add(db_progress)
    db.commit()
    db.refresh(db_progress)
    return db_progress


@router.post("/{user_id}/progress/complete", response_model=schemas.UserProgress)
def complete_lesson_progress(
    user_id: int,
    payload: schemas.LessonCompletionRequest,
    db: Session = Depends(get_db),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    course = db.query(models.Course).filter(models.Course.id == payload.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    title = db.query(models.Title).filter(models.Title.id == payload.title_id).first()
    if not title or title.course_id != payload.course_id:
        raise HTTPException(status_code=404, detail="Lesson not found for this course")

    existing_progress = (
        db.query(models.UserProgress)
        .filter(
            models.UserProgress.user_id == user_id,
            models.UserProgress.course_id == payload.course_id,
            models.UserProgress.title_id == payload.title_id,
        )
        .first()
    )

    if existing_progress:
        if existing_progress.completed:
            return existing_progress

        existing_progress.completed = True
        existing_progress.time_spent_seconds = max(payload.time_spent_seconds, 0)
        existing_progress.completed_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(existing_progress)
        return existing_progress

    db_progress = models.UserProgress(
        user_id=user_id,
        course_id=payload.course_id,
        title_id=payload.title_id,
        completed=True,
        time_spent_seconds=max(payload.time_spent_seconds, 0),
        completed_at=datetime.now(timezone.utc),
    )

    db.add(db_progress)
    db.commit()
    db.refresh(db_progress)
    return db_progress

@router.get("/{user_id}/progress", response_model=List[schemas.UserProgress])
def read_user_progress(user_id: int, db: Session = Depends(get_db)):
    progress = db.query(models.UserProgress).filter(models.UserProgress.user_id == user_id).all()
    return progress


@router.get("/{user_id}/progress/summary", response_model=schemas.UserProgressSummary)
def read_user_progress_summary(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    today = datetime.now(timezone.utc).date()
    today_seconds = (
        db.query(func.coalesce(func.sum(models.UserProgress.time_spent_seconds), 0))
        .filter(
            models.UserProgress.user_id == user_id,
            models.UserProgress.completed == True,
            func.date(models.UserProgress.completed_at) == today,
        )
        .scalar()
        or 0
    )

    total_seconds = (
        db.query(func.coalesce(func.sum(models.UserProgress.time_spent_seconds), 0))
        .filter(
            models.UserProgress.user_id == user_id,
            models.UserProgress.completed == True,
        )
        .scalar()
        or 0
    )

    all_courses = db.query(models.Course).all()
    course_summaries: List[schemas.CourseProgressSummary] = []

    for course in all_courses:
        completed_lessons = (
            db.query(func.count(models.UserProgress.id))
            .filter(
                models.UserProgress.user_id == user_id,
                models.UserProgress.course_id == course.id,
                models.UserProgress.completed == True,
            )
            .scalar()
            or 0
        )

        total_lessons = (
            db.query(func.count(models.Title.id))
            .filter(models.Title.course_id == course.id)
            .scalar()
            or 0
        )

        course_summaries.append(
            schemas.CourseProgressSummary(
                course_id=course.id,
                course_name=course.name,
                completed_lessons=completed_lessons,
                total_lessons=total_lessons,
            )
        )

    return schemas.UserProgressSummary(
        learned_today_minutes=int(today_seconds // 60),
        total_minutes=int(total_seconds // 60),
        goal_minutes=user.daily_goal_minutes,
        courses=course_summaries,
    )
