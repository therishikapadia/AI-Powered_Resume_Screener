from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import SessionLocal, engine
import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

router = APIRouter()

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/resumes/", response_model=schemas.Resume)
def create_resume(resume: schemas.ResumeCreate, db: Session = Depends(get_db)):
    db_resume = models.Resume(**resume.dict())
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    return db_resume

@router.get("/resumes/{resume_id}", response_model=schemas.Resume)
def read_resume(resume_id: int, db: Session = Depends(get_db)):
    db_resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    if db_resume is None:
        raise HTTPException(status_code=404, detail="Resume not found")
    return db_resume

@router.post("/resumes/screen", response_model=schemas.Resume)
def screen_resume(resume: schemas.ResumeCreate):
    # Call OpenAI to screen resume
    response = openai.Completion.create(
        engine="davinci-codex",
        prompt=f"Screen this resume: {resume.name}, {resume.email}, {resume.skills}",
        max_tokens=50
    )
    screening_result = response.choices[0].text.strip()
    return {"screening_result": screening_result}
