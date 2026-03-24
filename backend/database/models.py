from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)

    titles = relationship("Title", back_populates="course")

class Title(Base):
    __tablename__ = "titles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))

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
    answer_text = Column(Text)
    title_id = Column(Integer, ForeignKey("titles.id"))

    title = relationship("Title", back_populates="questions")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    progress = relationship("UserProgress", back_populates="user")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    title_id = Column(Integer, ForeignKey("titles.id"), nullable=True)
    completed = Column(Boolean, default=False)

    user = relationship("User", back_populates="progress")
    course = relationship("Course")
    title = relationship("Title")
