from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import models
from database.database import engine
from api.routers import courses, titles, users, tools

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Financially Fit API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
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
