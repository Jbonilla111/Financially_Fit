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

# --- User Progress ---
class UserProgressBase(BaseModel):
    course_id: Optional[int] = None
    title_id: Optional[int] = None
    completed: bool = False

class UserProgressCreate(UserProgressBase):
    pass

class UserProgress(UserProgressBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True

# --- User ---
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    progress: List[UserProgress] = []

    class Config:
        orm_mode = True
        
class ToolCalculationBase(BaseModel):
    tool_type: str
    inputs: str
    results: str
    created_at: str

class ToolCalculationCreate(ToolCalculationBase):
    pass

class ToolCalculation(ToolCalculationBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True