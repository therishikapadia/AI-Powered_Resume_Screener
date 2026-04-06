from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import pdfplumber
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

from .. import models, schemas
from ..database import SessionLocal, engine

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.JobPostingResponse)
def create_job(job: schemas.JobPostingCreate, db: Session = Depends(get_db)):
    db_job = models.JobPosting(**job.dict())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get("/", response_model=List[schemas.JobPostingResponse])
def get_jobs(db: Session = Depends(get_db)):
    return db.query(models.JobPosting).all()

@router.get("/{job_id}", response_model=schemas.JobPostingResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.JobPosting).filter(models.JobPosting.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.post("/{job_id}/candidates/upload", response_model=List[schemas.CandidateResponse])
async def upload_candidates(job_id: int, files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    job = db.query(models.JobPosting).filter(models.JobPosting.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    new_candidates = []
    
    for file in files:
        if not file.filename.endswith('.pdf'):
            continue # Skip non-pdf
        
        try:
            # Read and parse PDF
            contents = await file.read()
            # Save temporarily to parse (pdfplumber needs a path or file-like object)
            temp_path = f"/tmp/{file.filename}"
            with open(temp_path, "wb") as f:
                f.write(contents)
            
            raw_text = ""
            with pdfplumber.open(temp_path) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        raw_text += text + "\n"
            
            os.remove(temp_path)
            
            if not raw_text.strip():
                continue

            # Blind AI Screening - PII Redaction
            redaction_prompt = "You are a privacy redaction filter. Take the following resume text and replace the Candidate's Name, Email, Address, Phone Number, Gender, and University Name with '[REDACTED]'. Do not change any of the skills or experience. Return only the redacted text.\n\n" + raw_text
            try:
                redaction_model = genai.GenerativeModel('gemini-2.5-flash')
                redaction_resp = redaction_model.generate_content(redaction_prompt)
                sanitized_text = redaction_resp.text.strip()
            except Exception as e:
                print(f"Redaction failed: {e}")
                sanitized_text = raw_text

            candidate = models.Candidate(
                job_id=job_id,
                filename=file.filename,
                raw_text=sanitized_text
            )
            db.add(candidate)
            new_candidates.append(candidate)
        except Exception as e:
            print(f"Error parsing file {file.filename}: {e}")
            continue

    db.commit()
    for c in new_candidates:
        db.refresh(c)
        
    return new_candidates

@router.post("/{job_id}/rank")
def rank_candidates(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.JobPosting).filter(models.JobPosting.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    candidates = db.query(models.Candidate).filter(models.Candidate.job_id == job_id).all()
    if not candidates:
        raise HTTPException(status_code=400, detail="No candidates to rank")

    model = genai.GenerativeModel('gemini-2.5-flash')
    
    prompt = f"You are an expert technical recruiter. You are given a Job Description and a list of candidates' resumes. "
    prompt += f"\n\nJOB DESCRIPTION:\nTitle: {job.title}\nDescription: {job.description}\n\n"
    prompt += "CANDIDATES:\n"
    
    for c in candidates:
        prompt += f"--- Candidate ID {c.id} ({c.filename}) ---\n{c.raw_text}\n\n"
    
    prompt += """
    INSTRUCTIONS:
    Evaluate each candidate strictly against the Job Description. 
    Return your response strictly as a valid JSON array of objects. Do not use Markdown formatting for the JSON.
    Each object must have the following keys:
    "candidate_id" (integer)
    "score" (float out of 10)
    "pros" (array of strings)
    "cons" (array of strings)
    "reasoning" (string, structured reasoning)
    """

    try:
        response = model.generate_content(prompt)
        # Parse JSON
        resp_text = response.text.replace("```json", "").replace("```", "").strip()
        evaluations = json.loads(resp_text)
        
        # Save to DB
        results = []
        for eval_data in evaluations:
            cid = eval_data.get("candidate_id")
            # Clear old evaluation if exists
            old_eval = db.query(models.Evaluation).filter(models.Evaluation.candidate_id == cid).first()
            if old_eval:
                old_eval.score = eval_data.get("score")
                old_eval.pros = eval_data.get("pros", [])
                old_eval.cons = eval_data.get("cons", [])
                old_eval.reasoning = eval_data.get("reasoning", "")
                results.append(old_eval)
            else:
                new_eval = models.Evaluation(
                    candidate_id=cid,
                    score=eval_data.get("score"),
                    pros=eval_data.get("pros", []),
                    cons=eval_data.get("cons", []),
                    reasoning=eval_data.get("reasoning", "")
                )
                db.add(new_eval)
                results.append(new_eval)
        
        db.commit()
        return {"status": "success", "message": "Ranking completed"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Gemini API error or JSON parse error: {str(e)}")

@router.delete("/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.JobPosting).filter(models.JobPosting.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return {"status": "success", "message": "Job deleted"}

@router.delete("/{job_id}/candidates/{candidate_id}")
def delete_candidate(job_id: int, candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id, models.Candidate.job_id == job_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    db.delete(candidate)
    db.commit()
    return {"status": "success", "message": "Candidate deleted"}

@router.post("/{job_id}/chat")
def chat_with_candidates(job_id: int, req: schemas.ChatRequest, db: Session = Depends(get_db)):
    job = db.query(models.JobPosting).filter(models.JobPosting.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    candidates = db.query(models.Candidate).filter(models.Candidate.job_id == job_id).all()
    if not candidates:
        raise HTTPException(status_code=400, detail="No candidates to chat about")

    model = genai.GenerativeModel('gemini-2.5-flash')
    
    prompt = f"You are a helpful AI recruiting assistant. You are given a Job Description and a list of candidates' redacted resumes. Answer the user's question based strictly on the provided context.\n\n"
    prompt += f"JOB DESCRIPTION:\nTitle: {job.title}\nDescription: {job.description}\n\n"
    prompt += "CANDIDATES:\n"
    
    for c in candidates:
        prompt += f"--- Candidate ID {c.id} ({c.filename}) ---\n{c.raw_text}\n\n"
    
    prompt += f"USER QUESTION: {req.question}"

    try:
        response = model.generate_content(prompt)
        return {"answer": response.text.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini Chat API error: {str(e)}")
