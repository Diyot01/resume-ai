from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)

# This fixes CORS properly
CORS(app)
import os
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

@app.route("/analyze", methods=["POST", "OPTIONS"])
def analyze():

    # Handle preflight request
    if request.method == "OPTIONS":
        response = jsonify({})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST")
        return response

    try:
        # Read data from frontend
        data = request.get_json()
        resume = data["resume"]
        job = data["job"]
        time = data["time"]

        # Build prompt
        prompt = f"""You are a career coach AI. Analyze this resume for someone targeting a "{job}" role who has "{time}" to grow.

Resume:
{resume}

Reply with this exact JSON only, no extra text, no backticks. Generate quiz questions based on actual skills in the resume:
{{
  "ats_score": "82%",
  "hire_readiness": "Medium",
  "skill_freshness_months": 14,
  "extracted_skills": ["skill1", "skill2"],
  "skill_gaps": [
    {{"skill": "Docker", "importance": "High", "reason": "Expected in most job listings"}}
  ],
  "top_project": {{
    "title": "Project name",
    "why": "Why this project helps",
    "new_skills": ["skill1", "skill2"]
  }},
  "action_queue": [
    {{"action": "First thing to do", "time": "10 min"}},
    {{"action": "Second thing to do", "time": "1 week"}}
  ],
  "visibility": [
    {{"section": "Name and Contact", "attention": 95, "status": "high"}},
    {{"section": "Skills Section", "attention": 88, "status": "high"}},
    {{"section": "First Project", "attention": 72, "status": "high"}},
    {{"section": "Work Experience", "attention": 60, "status": "med"}},
    {{"section": "Education", "attention": 45, "status": "med"}},
    {{"section": "Certifications", "attention": 15, "status": "low"}}
  ],
  "visibility_tip": "One specific tip about what to move or change in the resume",
  "quiz": [
    {{
      "skill": "React",
      "question": "What does useState do in React?",
      "options": ["Styles a component", "Stores and updates data", "Makes API calls", "Creates routing"],
      "correct": 1
    }},
    {{
      "skill": "CSS",
      "question": "What does display flex do?",
      "options": ["Hides an element", "Makes element invisible", "Creates a flexible layout", "Adds a border"],
      "correct": 2
    }},
    {{
      "skill": "HTML",
      "question": "What tag creates a hyperlink?",
      "options": ["link", "href", "a", "url"],
      "correct": 2
    }}
  ]
}}"""

        # Call Groq API
        groq_response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "max_tokens": 1000,
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            }
        )

        # Parse response
        groq_data = groq_response.json()
        text = groq_data["choices"][0]["message"]["content"]
        text = text.replace("```json", "").replace("```", "").strip()
        parsed = json.loads(text)

        # Add CORS header and return
        response = jsonify(parsed)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    except Exception as e:
      import traceback
      traceback.print_exc()
      print("ERROR:", str(e))
      response = jsonify({"error": str(e)})
      response.headers.add("Access-Control-Allow-Origin", "*")
      return response, 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)