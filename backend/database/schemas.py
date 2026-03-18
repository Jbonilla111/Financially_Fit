from pydantic import BaseModel
from typing import List, Optional

class ContentBase(BaseModel):
    text_body: str

class ContentCreate(ContentBase):
    pass

class Content(ContentBase):
    id: int
    title_id: int
    class Config:
        orm_mode = True

class QuestionBase(BaseModel):
    question_text: str
    answer_text: str

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: int
    title_id: int
    class Config:
        orm_mode = True

class TitleBase(BaseModel):
    name: str

class TitleCreate(TitleBase):
    pass

class Title(TitleBase):
    id: int
    course_id: int
    contents: List[Content] = []
    questions: List[Question] = []
    class Config:
        orm_mode = True

class CourseBase(BaseModel):
    name: str
    description: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int
    titles: List[Title] = []
    class Config:
        orm_mode = True
