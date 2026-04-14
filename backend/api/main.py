from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
import os

from database import models
from database.database import engine
from api.routers import courses, titles, users, tools

# Create the database tables
models.Base.metadata.create_all(bind=engine)

# Ensure newly added columns exist for existing developer databases.
with engine.begin() as connection:
    connection.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_goal_minutes INTEGER DEFAULT 60"))
    connection.execute(text("ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER DEFAULT 0"))
    connection.execute(text("ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP NULL"))

app = FastAPI(title="Financially Fit API")

allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "*").split(",")
    if origin.strip()
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers
app.include_router(courses.router)
app.include_router(titles.router)
app.include_router(users.router)
app.include_router(tools.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Financially Fit Course API"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/healthz")
def healthz_check():
    return {"status": "ok"}