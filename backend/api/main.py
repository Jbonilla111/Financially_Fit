from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Financially Fit API is running!"}