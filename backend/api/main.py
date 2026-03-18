from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import models, schemas
from database.database import engine, get_db

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Financially Fit API")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Financially Fit Course API"}

# --- COURSES ---
@app.post("/courses/", response_model=schemas.Course)
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):
    db_course = models.Course(**course.dict())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@app.get("/courses/", response_model=List[schemas.Course])
def read_courses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    courses = db.query(models.Course).offset(skip).limit(limit).all()
    return courses

@app.get("/courses/{course_id}", response_model=schemas.Course)
def read_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

# --- TITLES ---
@app.get("/titles/name/{title_name}", response_model=schemas.Title)
def read_title_by_name(title_name: str, db: Session = Depends(get_db)):
    # Uses ilike for case-insensitive matching (e.g. "investment module" or "Investment Module")
    title = db.query(models.Title).filter(models.Title.name.ilike(title_name)).first()
    if title is None:
        raise HTTPException(status_code=404, detail="Title not found")
    return title

@app.get("/titles/{title_id}", response_model=schemas.Title)
def read_title(title_id: int, db: Session = Depends(get_db)):
    title = db.query(models.Title).filter(models.Title.id == title_id).first()
    if title is None:
        raise HTTPException(status_code=404, detail="Title not found")
    return title

@app.post("/courses/{course_id}/titles/", response_model=schemas.Title)
def create_title_for_course(course_id: int, title: schemas.TitleCreate, db: Session = Depends(get_db)):
    db_title = models.Title(**title.dict(), course_id=course_id)
    db.add(db_title)
    db.commit()
    db.refresh(db_title)
    return db_title

# --- CONTENT ---
@app.post("/titles/{title_id}/content/", response_model=schemas.Content)
def create_content_for_title(title_id: int, content: schemas.ContentCreate, db: Session = Depends(get_db)):
    db_content = models.Content(**content.dict(), title_id=title_id)
    db.add(db_content)
    db.commit()
    db.refresh(db_content)
    return db_content

# --- QUESTIONS ---
@app.get("/titles/{title_id}/questions/", response_model=List[schemas.Question])
def read_questions_for_title_by_id(title_id: int, db: Session = Depends(get_db)):
    questions = db.query(models.Question).filter(models.Question.title_id == title_id).all()
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for this title id")
    return questions

@app.get("/titles/name/{title_name}/questions/", response_model=List[schemas.Question])
def read_questions_for_title_by_name(title_name: str, db: Session = Depends(get_db)):
    title = db.query(models.Title).filter(models.Title.name.ilike(title_name)).first()
    if not title:
        raise HTTPException(status_code=404, detail="Title not found")
    questions = db.query(models.Question).filter(models.Question.title_id == title.id).all()
    return questions

@app.post("/titles/{title_id}/questions/", response_model=schemas.Question)
def create_question_for_title(title_id: int, question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    db_question = models.Question(**question.dict(), title_id=title_id)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question
