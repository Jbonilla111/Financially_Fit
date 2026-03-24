from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import models, schemas
from database.database import get_db

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Note: Passwords must be hashed in production! (using Passlib etc)
    fake_hashed_password = user.password + "notreallyhashed"
    
    # Check if user exists
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user = models.User(username=user.username, email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=schemas.User)
def login_user(user_login: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_login.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    fake_hashed_password = user_login.password + "notreallyhashed"
    if user.hashed_password != fake_hashed_password:
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

@router.get("/{user_id}/progress", response_model=List[schemas.UserProgress])
def read_user_progress(user_id: int, db: Session = Depends(get_db)):
    progress = db.query(models.UserProgress).filter(models.UserProgress.user_id == user_id).all()
    return progress
