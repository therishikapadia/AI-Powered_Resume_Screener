from sqlalchemy import Column, Integer, String
from .database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, index=True)
    skills = Column(String, index=True)

print("Models created successfully")
