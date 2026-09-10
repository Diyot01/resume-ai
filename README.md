# Resume AI — Career Intelligence Platform
 
An AI-powered full stack web application that analyzes resumes, verifies skills through an interactive quiz, simulates HR recruiter attention patterns, and generates a personalized career roadmap.
 
## Live Demo
 
- **Frontend:** https://resume-ai-frontend-uixr.onrender.com
- **Backend:** https://resume-ai-backend-j48x.onrender.com
## What Makes This Different
 
Most resume tools just check ATS keywords. Resume AI goes further:
 
- **Skill Verification Quiz** — instead of believing what's on your resume, the AI generates questions based on your claimed skills and verifies if you actually know them
- **HR Attention Heatmap** — simulates where a recruiter's eyes go when scanning your resume, identifying which sections get ignored
- **Personalized Project Recommendations** — suggests specific projects based on your exact skill gaps and target role
- **Prioritized Action Queue** — tells you exactly what to do next, ranked by impact with time estimates
## Features
 
- PDF resume upload with in-browser text extraction
- AI-powered resume analysis against a target job role and timeline
- ATS score, hire readiness rating, and skill freshness score
- Skill gap analysis with reasons based on current job market
- Interactive skill verification quiz with correct/wrong feedback
- HR attention heatmap showing which resume sections get read
- Best project recommendation with skills you'll learn
- Step-by-step action queue with time estimates
- Secure backend — API key never exposed in the browser
## Tech Stack
 
**Frontend**
- HTML5
- CSS3
- JavaScript (ES6+)
- PDF.js (in-browser PDF parsing)
- Fetch API / Async-Await
**Backend**
- Python 3.14
- Flask
- Flask-CORS
- Requests
- Gunicorn
**AI**
- Groq API
- OpenAI GPT-OSS 20B model
- Prompt Engineering
- Structured JSON output
**Deployment**
- Render (backend — Python web service)
- Render (frontend — static site)
- GitHub (version control)
## Project Structure
 
```
resume-ai/
│
├── index.html          # App structure and screens
├── style.css           # All styling
├── script.js           # Frontend logic, PDF parsing, API calls
│
└── backend/
    ├── app.py          # Flask server, Groq API integration
    ├── requirements.txt
    └── Procfile
```
 
## How It Works
 
```
User uploads PDF
      ↓
PDF.js extracts text in browser
      ↓
JavaScript sends resume + job + time to Flask backend
      ↓
Flask builds prompt and calls Groq API securely
      ↓
AI returns structured JSON analysis
      ↓
Skill verification quiz renders
      ↓
Full results dashboard displays
```
 
## Running Locally
 
**Backend**
 
```bash
cd backend
pip install -r requirements.txt
set GROQ_API_KEY=your-groq-key-here
python app.py
```
 
Server runs at `http://127.0.0.1:5000`
 
**Frontend**
 
Open `index.html` with VS Code Live Server or any static file server.
 
Make sure `script.js` fetch URL points to `http://127.0.0.1:5000/analyze` for local development.
 
## Environment Variables
 
| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your Groq API key from console.groq.com |
 
Never hardcode this key in your code. Set it as an environment variable locally and in your Render dashboard.
 
## Key Technical Decisions
 
**Why a Python backend?**
The API key lives on the server, never in the browser. This is the industry-standard approach to API security.
 
**Why PDF.js?**
PDF parsing happens entirely in the browser — no file upload to a server needed, keeping it fast and private.
 
**Why Groq?**
Fast inference, generous free tier, and compatible with the OpenAI API format making it easy to switch models.
 
**Why Render?**
Free tier for both static sites and web services, simple GitHub integration, and straightforward environment variable management.
 
## Future Improvements
 
- User authentication and resume history tracking
- Company-specific job description matching
- LinkedIn and GitHub profile integration
- Interview preparation mode
- React frontend rebuild
- Database integration with PostgreSQL
## Author
 
**Ayush Agarwal**
- GitHub: [Diyot01](https://github.com/Diyot01)
