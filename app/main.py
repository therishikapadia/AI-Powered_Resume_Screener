from fastapi import FastAPI
from .routes import resume

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to AI-Powered Resume Screener"}

app.include_router(resume.router, prefix="/resumes", tags=["resumes"])
