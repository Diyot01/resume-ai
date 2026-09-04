let analysisResult = null
let analyzeBtn = document.getElementById("analyzeBtn")
let resumeInput = document.getElementById("resumeInput")
let jobInput = document.getElementById("jobInput")
let timeInput = document.getElementById("timeInput")
let errorMsg = document.getElementById("errorMsg")
let screenInput = document.getElementById("screen-input")
let screenResults = document.getElementById("screen-results")
let screenQuiz = document.getElementById("screen-quiz")
let quizProgress = document.getElementById("quizProgress")
let quizSkillTag = document.getElementById("quiz-skill-tag")
let quizQuestion = document.getElementById("quiz-question")
let quizOptions = document.getElementById("quiz-options")
let quizFeedback = document.getElementById("quiz-feedback")
let quizNextBtn = document.getElementById("quizNextBtn")
let resultsText = document.getElementById("resultsText")

let quizQuestions = []
let quizIndex = 0
let quizAnswers = []

analyzeBtn.onclick = async function() {

  let resume = resumeInput.value
  let job = jobInput.value
  let time = timeInput.value

  if (resume === "") {
    errorMsg.textContent = "Please upload your resume PDF first."
    return
  }
  if (job === "") {
    errorMsg.textContent = "Please enter your target job role."
    return
  }
  if (time === "") {
    errorMsg.textContent = "Please select how much time you have."
    return
  }

  errorMsg.textContent = ""
  analyzeBtn.textContent = "Analyzing..."
  analyzeBtn.disabled = true

  try {
    let response = await fetch("https://resume-ai-backend-j48x.onrender.com/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        resume: resume,
        job: job,
        time: time
      })
    })

    let result = await response.json()
    analysisResult = result
    console.log("Backend response:", result)

    quizQuestions = result.quiz
    quizIndex = 0
    quizAnswers = []
    screenInput.style.display = "none"
    screenQuiz.style.display = "block"
    renderQuestion()

  } catch(error) {
    console.log("Error:", error)
    errorMsg.textContent = "Something went wrong. Please try again."
  }

  analyzeBtn.textContent = "Analyze My Resume"
  analyzeBtn.disabled = false
}

function renderQuestion() {
  let q = quizQuestions[quizIndex]
  let pct = Math.round((quizIndex / quizQuestions.length) * 100)

  quizProgress.style.width = pct + "%"

  quizSkillTag.innerHTML = `<span class="skill-tag">${q.skill}</span>
    <span style="font-size:12px; color:#888; margin-left:8px;">
      Question ${quizIndex + 1} of ${quizQuestions.length}
    </span>`

  quizQuestion.innerHTML = `<div class="quiz-q">${q.question}</div>`

  quizOptions.innerHTML = q.options.map((o, i) => `
    <button class="quiz-opt" onclick="selectAnswer(${i})">${o}</button>
  `).join("")

  quizFeedback.textContent = ""
  quizNextBtn.style.display = "none"
}

function selectAnswer(idx) {
  let q = quizQuestions[quizIndex]

  document.querySelectorAll(".quiz-opt").forEach(btn => btn.onclick = null)

  let opts = document.querySelectorAll(".quiz-opt")
  opts[q.correct].classList.add("correct")
  if (idx !== q.correct) {
    opts[idx].classList.add("wrong")
    quizFeedback.textContent = "Not quite — the correct answer is highlighted above."
    quizFeedback.style.color = "#cc3333"
  } else {
    quizFeedback.textContent = "Correct! Well done."
    quizFeedback.style.color = "#2a7a2a"
  }

  quizAnswers.push({ skill: q.skill, correct: idx === q.correct })

  quizNextBtn.style.display = "block"
  if (quizIndex === quizQuestions.length - 1) {
    quizNextBtn.textContent = "See My Results →"
  }
}

function nextQuestion() {
  quizIndex++
  if (quizIndex >= quizQuestions.length) {
    showResults()
  } else {
    renderQuestion()
  }
}

function showResults() {
  screenQuiz.style.display = "none"
  screenResults.style.display = "block"
  displayResults(analysisResult)
}

function displayResults(result) {
  resultsText.innerHTML = `
    <div class="score-row">
      <div class="score-box">
        <div class="value">${result.ats_score}</div>
        <div class="label">ATS Score</div>
      </div>
      <div class="score-box">
        <div class="value">${result.hire_readiness}</div>
        <div class="label">Hire Readiness</div>
      </div>
      <div class="score-box">
        <div class="value">${result.skill_freshness_months}</div>
        <div class="label">Months Relevant</div>
      </div>
    </div>

    <h3>Your Skills</h3>
    <div class="skills-wrap">
      ${result.extracted_skills.map(s => `<span class="skill-pill">${s}</span>`).join("")}
    </div>

    <h3>Skills You Are Missing</h3>
    ${result.skill_gaps.map(g => `
      <div class="gap-item">
        <span>${g.skill}</span> — ${g.reason}
      </div>
    `).join("")}

    <h3>Best Project To Build</h3>
    <div class="project-box">
      <div class="project-title">${result.top_project.title}</div>
      <div class="project-why">${result.top_project.why}</div>
    </div>

    <h3>Your Action Queue</h3>
    <div>
      ${result.action_queue.map((a, i) => `
        <div class="queue-item">
          <div class="queue-num">${i + 1}</div>
          <div>${a.action}</div>
          <div class="queue-time">${a.time}</div>
        </div>
      `).join("")}
    </div>

    <h3>Resume Visibility Heatmap</h3>
    <p style="font-size:13px; color:#888; margin-bottom:12px;">Where HR attention goes on your resume. Most recruiters spend 6-8 seconds.</p>
    <div class="heatmap-wrap">
      ${result.visibility.map(v => `
        <div class="heat-row">
          <div class="heat-label">${v.section}</div>
          <div class="heat-bar-track">
            <div class="heat-bar-fill heat-${v.status}" style="width: ${v.attention}%"></div>
          </div>
          <div class="heat-pct">${v.attention}%</div>
        </div>
      `).join("")}
    </div>
    <div class="visibility-tip">
      💡 ${result.visibility_tip}
    </div>

    <button class="back-btn" onclick="goBack()">Analyze Another Resume</button>
  `
}

function goBack() {
  screenInput.style.display = "block"
  screenResults.style.display = "none"
  screenQuiz.style.display = "none"
  resumeInput.value = ""
  jobInput.value = ""
  timeInput.value = ""
  errorMsg.textContent = ""

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

document.getElementById('pdfInput').onchange = async function(e) {
  let file = e.target.files[0]
  if (!file) return

  document.getElementById('uploadText').textContent = "Reading " + file.name + "..."
  document.getElementById('uploadZone').style.borderColor = "#1a56cc"

  try {
    let arrayBuffer = await file.arrayBuffer()

    let pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    let fullText = ""
    for (let i = 1; i <= pdf.numPages; i++) {
      let page = await pdf.getPage(i)
      let content = await page.getTextContent()
      let pageText = content.items.map(item => item.str).join(" ")
      fullText += pageText + "\n"
    }

    document.getElementById('resumeInput').value = fullText

    document.getElementById('uploadText').textContent = "✅ " + file.name + " uploaded successfully"
    document.getElementById('uploadZone').style.borderColor = "#2a7a2a"
    document.getElementById('uploadZone').style.background = "#f0fff0"

  } catch(err) {
    document.getElementById('uploadText').textContent = "❌ Failed to read PDF. Try another file."
    document.getElementById('uploadZone').style.borderColor = "#cc3333"
    console.log("PDF error:", err)
  }
}
}