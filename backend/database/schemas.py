from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime


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
    answer_text: Optional[str] = None
    options: Optional[str] = None
    explanation: Optional[str] = None
    correct_answer_index: Optional[int] = None
    quiz_id: Optional[str] = None
    quiz_title: Optional[str] = None
    course_id: Optional[int] = None


class QuestionCreate(QuestionBase):
    pass


class Question(QuestionBase):
    id: int
    title_id: Optional[int] = None

    class Config:
        orm_mode = True


class TitleBase(BaseModel):
    name: str
    lesson_key: Optional[str] = None
    content_type: Optional[str] = None
    lesson_order: Optional[int] = None
    key_concepts: Optional[str] = None


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
    module_key: Optional[str] = None
    difficulty_level: Optional[str] = None
    estimated_completion_time: Optional[str] = None
    prerequisites: Optional[str] = None
    learning_objectives: Optional[str] = None


class CourseCreate(CourseBase):
    pass


class Course(CourseBase):
    id: int
    titles: List[Title] = []

    class Config:
        orm_mode = True


class CalculatorBase(BaseModel):
    calculator_id: str
    title: str
    inputs: str
    outputs: str


class CalculatorCreate(CalculatorBase):
    pass


class Calculator(CalculatorBase):
    id: int
    course_id: int

    class Config:
        orm_mode = True


# --- User Progress ---
class UserProgressBase(BaseModel):
    course_id: Optional[int] = None
    title_id: Optional[int] = None
    completed: bool = False
    time_spent_seconds: int = 0


class UserProgressCreate(UserProgressBase):
    pass


class UserProgress(UserProgressBase):
    id: int
    user_id: int
    completed_at: Optional[datetime] = None

    class Config:
        orm_mode = True


# --- User ---
class UserBase(BaseModel):
    username: str
    email: str


class UserCreate(UserBase):
    password: str = Field(min_length=6)


class UserLogin(BaseModel):
    email: str
    password: str = Field(min_length=6)


class User(UserBase):
    id: int
    daily_goal_minutes: int = 60
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


# --- Tool Request Schemas ---

class LoanCalculationRequest(BaseModel):
    loan_amount: float
    annual_interest_rate: float
    loan_term_years: int
    user_id: int


class InvestmentCalculationRequest(BaseModel):
    initial_amount: float
    annual_interest_rate: float
    years: int
    monthly_contribution: float
    user_id: int


class SavingsCalculationRequest(BaseModel):
    savings_goal: float
    current_savings: float
    monthly_contribution: float
    annual_interest_rate: float
    user_id: int


class InsuranceCalculationRequest(BaseModel):
    age: int
    coverage_amount: float
    term_years: int
    user_id: int


class LessonCompletionRequest(BaseModel):
    course_id: int
    title_id: int
    time_spent_seconds: int = 0


class CourseProgressSummary(BaseModel):
    course_id: int
    course_name: str
    completed_lessons: int
    total_lessons: int


class UserProgressSummary(BaseModel):
    learned_today_minutes: int
    total_minutes: int
    goal_minutes: int
    courses: List[CourseProgressSummary] = []