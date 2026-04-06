# AI-Powered Resume Screener & HR Assistant

A full-stack AI hiring platform designed to automate resume screening, evaluate candidates against technical job descriptions, and query talent pools conversationally using Vectorless RAG. Built with FastAPI, PostgreSQL, React, Tailwind CSS, and Google Gemini.

## 🚀 Key Features

### 1. Vectorless RAG Candidate Chat
Talk to your database. Recruiters can query the entire pool of candidates simultaneously through a conversational AI interface. Because the system utilizes **Vectorless RAG** (Retrieval-Augmented Generation), it loads massive candidate context directly into the Gemini model, completely eliminating the complexity, latency, and drift associated with intermediate Vector Databases.
* **Example Query**: *"Which candidate has the most backend experience with Python?"*

### 2. Implicit Bias Mitigation (Blind Screening)
AI fairness is critical in modern HR applications. This system includes an automated Pre-Processing Privacy Filter. When PDF resumes are parsed, they pass through a redaction model that automatically scrubs Personally Identifiable Information (PII) such as Names, Emails, Phone Numbers, Addresses, and Genders. The evaluation engine scores strictly on skills and experience.

### 3. Automated Structured Candidate Rankings
The core evaluation engine takes a dynamic Job Description and scores all uploaded candidates autonomously. It outputs rigorously validated Structured JSON containing:
- Specific `Score` out of 10.
- `Pros` and `Cons` arrays tailored precisely to the Job Description gap analysis.
- Explanatory `Reasoning` for internal recruiter audit trails.

### 4. Modern, Performant Architecture
- **Backend / Database**: Built on asynchronous **FastAPI** leveraging **SQLAlchemy** (PostgreSQL). Robust CRUD capabilities for multi-job posting tracking and candidate deletion. Uses `pdfplumber` for in-memory parsing without filesystem bloat.
- **Frontend**: Clean, responsive **React + Tailwind v4** Single Page Application featuring interactive Dark/Light modes, elegant evaluation cards, and live AI polling components.

---

## 🛠️ Tech Stack

* **Backend**: Python, FastAPI, SQLAlchemy, PostgreSQL, `pdfplumber`
* **Frontend**: React, Vite, Tailwind CSS v4, Lucide React, Axios
* **AI Engine**: Google Gemini API (`gemini-2.5-flash`)

## 🚦 Getting Started

### Prerequisites
- Python 3.9+
- Node.js & npm
- PostgreSQL database
- Google Gemini API Key

### Backend Setup
1. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   DATABASE_URL=postgresql://user:password@localhost/dbname
   ```
4. Start the FastAPI server (auto-reloads on changes):
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## 🧠 Future Roadmap
- WebSocket support for live, streaming evaluation results.
- Automated interview question generation based on candidate's exact weaknesses (identified in the `Cons` list).
