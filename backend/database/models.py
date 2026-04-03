from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship

from .database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    module_key = Column(String, unique=True, index=True, nullable=True)
    difficulty_level = Column(String, nullable=True)
    estimated_completion_time = Column(String, nullable=True)
    prerequisites = Column(Text, nullable=True)
    learning_objectives = Column(Text, nullable=True)

    titles = relationship("Title", back_populates="course")
    questions = relationship("Question", back_populates="course")
    calculators = relationship("Calculator", back_populates="course")


class Title(Base):
    __tablename__ = "titles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    lesson_key = Column(String, index=True, nullable=True)
    content_type = Column(String, nullable=True)
    lesson_order = Column(Integer, nullable=True)
    key_concepts = Column(Text, nullable=True)

    course = relationship("Course", back_populates="titles")
    contents = relationship("Content", back_populates="title")
    questions = relationship("Question", back_populates="title")


class Content(Base):
    __tablename__ = "contents"

    id = Column(Integer, primary_key=True, index=True)
    text_body = Column(Text)
    title_id = Column(Integer, ForeignKey("titles.id"))

    title = relationship("Title", back_populates="contents")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(String)
    answer_text = Column(Text, nullable=True)
    options = Column(Text, nullable=True)
    explanation = Column(Text, nullable=True)
    correct_answer_index = Column(Integer, nullable=True)
    quiz_id = Column(String, index=True, nullable=True)
    quiz_title = Column(String, nullable=True)
    title_id = Column(Integer, ForeignKey("titles.id"), nullable=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)

    title = relationship("Title", back_populates="questions")
    course = relationship("Course", back_populates="questions")


class Calculator(Base):
    __tablename__ = "calculators"

    id = Column(Integer, primary_key=True, index=True)
    calculator_id = Column(String, index=True)
    title = Column(String)
    inputs = Column(Text)
    outputs = Column(Text)
    course_id = Column(Integer, ForeignKey("courses.id"))

    course = relationship("Course", back_populates="calculators")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    daily_goal_minutes = Column(Integer, default=60, nullable=False)

    progress = relationship("UserProgress", back_populates="user")
    calculations = relationship("ToolCalculation", back_populates="user")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    title_id = Column(Integer, ForeignKey("titles.id"), nullable=True)
    completed = Column(Boolean, default=False)
    time_spent_seconds = Column(Integer, default=0, nullable=False)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="progress")
    course = relationship("Course")
    title = relationship("Title")


class ToolCalculation(Base):
    __tablename__ = "tool_calculations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    tool_type = Column(String)
    inputs = Column(Text)
    results = Column(Text)
    created_at = Column(String)

    user = relationship("User", back_populates="calculations")