from pydantic import BaseModel

class ResumeBase(BaseModel):
    name: str
    email: str
    skills: str

class ResumeCreate(ResumeBase):
    pass

class Resume(ResumeBase):
    id: int

    class Config:
        orm_mode = True
