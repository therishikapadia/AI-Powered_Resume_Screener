from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class EvaluationBase(BaseModel):
    score: float
    pros: List[str]
    cons: List[str]
    reasoning: str

class EvaluationResponse(EvaluationBase):
    id: int
    candidate_id: int

    class Config:
        orm_mode = True

class CandidateBase(BaseModel):
    filename: str

class CandidateCreate(CandidateBase):
    raw_text: str

class CandidateResponse(CandidateBase):
    id: int
    job_id: int
    created_at: datetime
    evaluation: Optional[EvaluationResponse] = None

    class Config:
        orm_mode = True

class JobPostingBase(BaseModel):
    title: str
    description: str

class JobPostingCreate(JobPostingBase):
    pass

class JobPostingResponse(JobPostingBase):
    id: int
    created_at: datetime
    candidates: List[CandidateResponse] = []

    class Config:
        orm_mode = True

class ChatRequest(BaseModel):
    question: str
