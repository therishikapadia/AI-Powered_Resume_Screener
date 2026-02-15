📄 AI-Powered Resume Screener using FastAPI, PostgreSQL & OpenAI
🚀 Streamline Resume Screening with AI & Automation

📌 Project Overview
This project is an AI-powered resume screening system that leverages FastAPI, PostgreSQL, and OpenAI to automate and enhance the hiring process. It helps recruiters quickly analyze resumes, extract key information, and shortlist candidates efficiently.

## 📸 Screenshots

![🛠️ Tech Stack ](images/Screenshot1.png)


![File Structure](images/Screenshot2.png)


******************************************************************************************************
🛠️ Setup & Installation
1️⃣ Clone the Repository:
git clone https://github.com/Naveensmart48/AI-Powered-Resume-Screener-FastAPI-PostgreSQL-OpenAI-.git
cd AI-Powered-Resume-Screener

******************************************************************************************************
2️⃣ Create a Virtual Environment
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows

******************************************************************************************************

 Install Dependencies
pip install -r requirements.txt

******************************************************************************************************

Set Up Environment Variables
Create a .env file and add:
OPENAI_API_KEY=your_openai_api_key_here  
DATABASE_URL=postgresql://user:password@localhost:5432/resumedb  

******************************************************************************************************
Run the Server
uvicorn main:app --reload

******************************************************************************************************
API will be available at: http://127.0.0.1:8000 🚀