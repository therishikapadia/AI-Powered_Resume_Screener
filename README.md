# AI-Powered Resume Screener

An intelligent resume screening application that leverages OpenAI to evaluate candidate profiles based on their input skills. This tool streamlines the initial recruitment process by providing instant automated feedback on candidate suitability.

## Key Features

- **AI-Powered Analysis**: Automatically screens resumes using OpenAI's advanced language models to provide instant feedback.
- **Modern UI**: Clean, responsive interface featuring Dark Mode support for better usability.
- **Real-time Feedback**: Instant evaluation results displayed in an interactive modal.
- **Database Integration**: Securely stores candidate information including Name, Email, and Skills using PostgreSQL.
- **RESTful API**: Built on high-performance FastAPI for robust backend processing.

## Tech Stack

This project is built using the following technologies:

- **Frontend**:
  - HTML5
  - CSS3 (Responsive Design)
  - JavaScript (Vanilla ES6+)
- **Backend**: 
  - Python 3.x
  - FastAPI
  - Uvicorn (ASGI Server)
- **Database**:
  - PostgreSQL
  - SQLAlchemy (ORM)
- **AI Integration**:
  - OpenAI API

## Screenshots

![Screenshot 1](images/Screenshot1.png)
![Screenshot 2](images/Screenshot2.png)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- Python 3.8 or higher
- PostgreSQL database
- OpenAI API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/AI-Powered-Resume-Screener.git
   cd AI-Powered-Resume-Screener
   ```

2. **Set up the backend environment**
   
   It's recommended to use a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

   Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory of the project and add your configuration:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   DATABASE_URL=postgresql://user:password@localhost/dbname
   ```

4. **Run the Application**

   Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

   The backend API will be available at `http://127.0.0.1:8000`.

5. **Access the Frontend**

   Open the `index.html` file in your preferred web browser. 
   
   *Note: Since the frontend makes fetch requests to the backend, ensure your server is running. You may need to configure wait for the frontend to be served or configure CORS if running directly from the file system.*

## License

This project is licensed under the MIT License.
