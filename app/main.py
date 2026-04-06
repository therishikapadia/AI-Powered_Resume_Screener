from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .routes import jobs
from .models import Base
from .database import engine
import os

app = FastAPI()

# Drop existing tables and recreate them for the new schema
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the jobs router
app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])


