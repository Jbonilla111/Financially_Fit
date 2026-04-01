from fastapi import FastAPI

from database import models
from database.database import engine
from api.routers import courses, titles, users, tools

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Financially Fit API")

# Include the routers
app.include_router(courses.router)
app.include_router(titles.router)
app.include_router(users.router)
app.include_router(tools.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Financially Fit Course API"}