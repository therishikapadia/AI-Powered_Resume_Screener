from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .routes import resume
import os

app = FastAPI()

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the resume router
app.include_router(resume.router, prefix="/resumes", tags=["resumes"])

# Serve the static frontend files
# Get the absolute path to the root directory
base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

@app.get("/")
async def read_index():
    return FileResponse(os.path.join(base_path, "index.html"))

# Mount other static files (js, css, images)
app.mount("/", StaticFiles(directory=base_path, html=True), name="static")
