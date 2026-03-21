from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import models, schemas
from database.database import get_db

router = APIRouter(prefix="/titles", tags=["Titles"])

@router.get("/name/{title_name}", response_model=schemas.Title)
def read_title_by_name(title_name: str, db: Session = Depends(get_db)):
    title = db.query(models.Title).filter(models.Title.name.ilike(title_name)).first()
    if title is None:
        raise HTTPException(status_code=404, detail="Title not found")
    return title

@router.get("/{title_id}", response_model=schemas.Title)
def read_title(title_id: int, db: Session = Depends(get_db)):
    title = db.query(models.Title).filter(models.Title.id == title_id).first()
    if title is None:
        raise HTTPException(status_code=404, detail="Title not found")
    return title

@router.post("/{title_id}/content/", response_model=schemas.Content)
def create_content_for_title(title_id: int, content: schemas.ContentCreate, db: Session = Depends(get_db)):
    db_content = models.Content(**content.dict(), title_id=title_id)
    db.add(db_content)
    db.commit()
    db.refresh(db_content)
    return db_content

@router.get("/{title_id}/questions/", response_model=List[schemas.Question])
def read_questions_for_title_by_id(title_id: int, db: Session = Depends(get_db)):
    questions = db.query(models.Question).filter(models.Question.title_id == title_id).all()
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for this title id")
    return questions

@router.get("/name/{title_name}/questions/", response_model=List[schemas.Question])
def read_questions_for_title_by_name(title_name: str, db: Session = Depends(get_db)):
    title = db.query(models.Title).filter(models.Title.name.ilike(title_name)).first()
    if not title:
        raise HTTPException(status_code=404, detail="Title not found")
    questions = db.query(models.Question).filter(models.Question.title_id == title.id).all()
    return questions

@router.post("/{title_id}/questions/", response_model=schemas.Question)
def create_question_for_title(title_id: int, question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    db_question = models.Question(**question.dict(), title_id=title_id)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question
