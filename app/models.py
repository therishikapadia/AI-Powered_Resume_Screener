from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class JobPosting(Base):
    __tablename__ = "job_postings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    candidates = relationship("Candidate", back_populates="job", cascade="all, delete-orphan")

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("job_postings.id"))
    filename = Column(String)
    raw_text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("JobPosting", back_populates="candidates")
    evaluation = relationship("Evaluation", back_populates="candidate", uselist=False, cascade="all, delete-orphan")

class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), unique=True)
    score = Column(Float)
    pros = Column(JSON)
    cons = Column(JSON)
    reasoning = Column(Text)

    candidate = relationship("Candidate", back_populates="evaluation")
