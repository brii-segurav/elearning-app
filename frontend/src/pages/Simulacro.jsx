import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../services/api"
import Icon from "../components/Icon"
import { useT } from "../i18n.jsx"

const TIME_LIMIT = 5400

function formatTime(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0")
  const s = (sec % 60).toString().padStart(2, "0")
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`
}

function Simulacro() {
  const navigate = useNavigate()
  const user     = JSON.parse(localStorage.getItem("user")) || {}
  const t        = useT()

  const [phase, setPhase]       = useState("intro")
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers]   = useState({})
  const [current, setCurrent]   = useState(0)
  const [loading, setLoading]   = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [timeUp, setTimeUp]     = useState(false)
  const [results, setResults]   = useState(null)

  const startExam = async () => {
    setLoading(true)
    try {
      const data = await api.get("/simulacro")
      setQuestions(data.questions)
      setPhase("exam")
    } catch {
      alert("No se pudo cargar el simulacro.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (phase !== "exam" || timeUp) return
    if (timeLeft <= 0) { handleFinish(true); return }
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(id); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [phase, timeUp, timeLeft])

  const handleSelect = useCallback((questionId, letter) => {
    setAnswers(prev => ({ ...prev, [questionId]: letter }))
  }, [])

  const handleFinish = async (forced = false) => {
    setTimeUp(forced)
    let correct = 0
    const detailedResults = []

    for (const q of questions) {
      const selected = answers[q.id] || null
      let isCorrect = false
      let correctAns = "?"
      let explanation = ""

      if (selected) {
        try {
          const res = await api.post("/attempt", {
            user_id: user.id, question_id: q.id, selected_answer: selected
          })
          isCorrect = res.is_correct
          correctAns = res.correct_answer
          explanation = res.explanation || ""
          if (isCorrect) correct++
        } catch { }
      }

      detailedResults.push({
        question: q.question, context_text: q.context_text,
        selected, correct_answer: correctAns, is_correct: isCorrect, explanation,
        option_a: q.option_a, option_b: q.option_b, option_c: q.option_c, option_d: q.option_d,
      })
    }

    const timeUsed = TIME_LIMIT - timeLeft
    const score = Math.round((correct / questions.length) * 100)

    try {
      await api.post("/exam-result", {
        user_id: user.id, exam_type: "simulacro",
        total_questions: questions.length, correct_answers: correct,
        time_used_seconds: timeUsed
      })
    } catch { }

    setResults({ correct, total: questions.length, score, timeUsed, detail: detailedResults, forced })
    setPhase("results")
  }

  // ── INTRO ─────────────────────────────────────────────────────────────────
  if (phase === "intro") return (
    <div className="page">
      <nav className="navbar">
        <div className="navbar-brand">
          <Icon id="flask" size={20} style={{ marginRight: ".4rem" }} />
          <span>Cognia Lab</span>
        </div>
        <div className="navbar-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/dashboard")}>
            {t("dashboard")}
          </button>
        </div>
      </nav>
      <div className="container main-content">
        <div className="card fade-in" style={{ maxWidth: "600px", margin: "2rem auto" }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem", color: "var(--primary)" }}>
            <Icon id="scroll" size={56} />
          </div>
          <h2 style={{ textAlign: "center", marginBottom: ".5rem" }}>{t("simulacroTitle")}</h2>
          <p style={{ textAlign: "center", marginBottom: "2rem" }}>{t("officialFormat")}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem", marginBottom: "2rem" }}>
            {[
              { iconId: "scroll",    text: t("questions50") },
              { iconId: "clock",     text: t("time90") },
              { iconId: "warning",   text: t("blockedOnTime") },
              { iconId: "chart",     text: t("gradeScale") },
              { iconId: "lightbulb", text: t("detailedReview") },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: ".75rem",
                padding: ".75rem 1rem", background: "var(--surface2)",
                borderRadius: "8px", fontSize: ".95rem"
              }}>
                <Icon id={item.iconId} size={18} style={{ color: "var(--primary)", flexShrink: 0 }} />
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button className="btn btn-outline" onClick={() => navigate("/dashboard")}>{t("cancel")}</button>
            <button className="btn btn-primary" onClick={startExam} disabled={loading}
              style={{ display: "inline-flex", alignItems: "center", gap: ".5rem" }}>
              {loading
                ? <span>{t("loading")}</span>
                : <><span>{t("startSimulacro")}</span><Icon id="arrow-right" size={16} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // ── EXAMEN ────────────────────────────────────────────────────────────────
  if (phase === "exam") {
    const q            = questions[current]
    const timerWarning = timeLeft <= 300
    const answered     = Object.keys(answers).length
    const options      = [
      { letter: "A", text: q.option_a },
      { letter: "B", text: q.option_b },
      { letter: "C", text: q.option_c },
      { letter: "D", text: q.option_d },
    ]

    return (
      <div className="page">
        <nav className="navbar">
          <div className="navbar-brand">
            <Icon id="flask" size={20} style={{ marginRight: ".4rem" }} />
            <span>{t("simulacroTitle")}</span>
          </div>
          <div className="navbar-actions">
            <span style={{
              fontWeight: 700, fontSize: "1rem", fontFamily: "monospace",
              color: timerWarning ? "var(--danger)" : "var(--text)",
              background: timerWarning ? "#FEE2E2" : "var(--surface2)",
              padding: ".3rem .75rem", borderRadius: "8px",
              display: "inline-flex", alignItems: "center", gap: ".4rem"
            }}>
              <Icon id="clock" size={16} />
              <span>{formatTime(timeLeft)}</span>
            </span>
            <span style={{ fontSize: ".85rem", color: "var(--text-muted)" }}>
              <span>{answered}</span>/<span>{questions.length}</span> {t("answered")}
            </span>
            <button className="btn btn-outline btn-sm" onClick={() => handleFinish(false)}>
              {t("finish")}
            </button>
          </div>
        </nav>

        <div className="container main-content simulacro-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: "1.5rem", alignItems: "start" }}>

          <div>
            <div style={{ marginBottom: "1.5rem" }}>
              <div className="flex-between" style={{ marginBottom: ".5rem", fontSize: ".85rem" }}>
                <span className="text-muted">
                  {t("question")} <strong>{current + 1}</strong> {t("of")} <strong>{questions.length}</strong>
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${(answered / questions.length) * 100}%`, transition: "width 0.3s ease" }} />
              </div>
            </div>

            {q.context_text && (
              <div className="card" style={{
                marginBottom: "1.25rem", background: "var(--surface2)",
                borderLeft: "4px solid var(--primary)", fontSize: ".92rem", lineHeight: "1.7"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem",
                              marginBottom: ".75rem", fontWeight: 600, color: "var(--primary)" }}>
                  <Icon id="scroll" size={16} />
                  <span>{t("readText")}</span>
                </div>
                <div style={{ whiteSpace: "pre-line" }}>{q.context_text}</div>
              </div>
            )}

            <div className="card question-card">
              <p className="question-text">{q.question}</p>
              <div className="options-list">
                {options.map(opt => (
                  <button key={opt.letter}
                    className={`option-btn ${answers[q.id] === opt.letter ? "selected" : ""}`}
                    onClick={() => handleSelect(q.id, opt.letter)}>
                    <span className="option-letter">{opt.letter}</span>
                    <span>{opt.text}</span>
                    {answers[q.id] === opt.letter && (
                      <span style={{ marginLeft: "auto", color: "var(--primary)" }}>
                        <Icon id="check-circle" size={18} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
                <button className="btn btn-outline" onClick={() => setCurrent(c => Math.max(0, c - 1))}
                  disabled={current === 0}>
                  {t("previous")}
                </button>
                {current < questions.length - 1
                  ? <button className="btn btn-primary" onClick={() => setCurrent(c => c + 1)}>
                      {t("next")} →
                    </button>
                  : <button className="btn btn-primary" onClick={() => handleFinish(false)}>
                      {t("finishExam")}
                    </button>
                }
              </div>
            </div>
          </div>

          <div className="card simulacro-nav-panel" style={{ position: "sticky", top: "80px" }}>
            <p style={{ fontWeight: 600, marginBottom: ".75rem", fontSize: ".9rem" }}>{t("navigation")}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: ".3rem" }}>
              {questions.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} style={{
                  padding: ".4rem", borderRadius: "6px", border: "none", cursor: "pointer",
                  fontSize: ".8rem", fontWeight: 600,
                  background: current === i ? "var(--primary)" : answers[questions[i].id] ? "#D1FAE5" : "var(--surface2)",
                  color: current === i ? "#fff" : answers[questions[i].id] ? "#065F46" : "var(--text-muted)"
                }}>
                  {i + 1}
                </button>
              ))}
            </div>
            <div style={{ marginTop: "1rem", fontSize: ".8rem", color: "var(--text-muted)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".4rem", marginBottom: ".3rem" }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: "#D1FAE5", display: "inline-block" }} />
                <span>{t("answered")}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: "var(--surface2)", border: "1px solid var(--border)", display: "inline-block" }} />
                <span>{t("unanswered")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── RESULTADOS ────────────────────────────────────────────────────────────
  if (phase === "results" && results) {
    const { correct, total, score, timeUsed, detail, forced } = results
    const passed     = score >= 70
    const gradeIcon  = score >= 90 ? "trophy" : score >= 70 ? "star" : "check-circle"
    const gradeColor = score >= 90 ? "#F59E0B" : score >= 70 ? "#6366F1" : "var(--success)"

    return (
      <div className="page">
        <nav className="navbar">
          <div className="navbar-brand">
            <Icon id="flask" size={20} style={{ marginRight: ".4rem" }} />
            <span>Cognia Lab</span>
          </div>
        </nav>
        <div className="container main-content">

          <div className="card fade-in" style={{ maxWidth: "600px", margin: "0 auto 2rem", textAlign: "center" }}>
            {forced && (
              <div style={{ background: "#FEE2E2", color: "#991B1B", borderRadius: "8px",
                            padding: ".75rem 1rem", marginBottom: "1rem", fontWeight: 600,
                            display: "flex", alignItems: "center", gap: ".5rem", justifyContent: "center" }}>
                <Icon id="warning" size={16} />
                <span>{t("timeExpired")}</span>
              </div>
            )}

            <div style={{ color: gradeColor, marginBottom: "1rem" }}>
              <Icon id={gradeIcon} size={64} />
            </div>
            <h2 style={{ marginBottom: ".25rem" }}>{t("simulacroCompleted")}</h2>
            <p style={{ marginBottom: "1.5rem" }}>{passed ? t("passed") : t("failed")}</p>

            <div style={{
              fontSize: "3rem", fontWeight: 800,
              color: passed ? "var(--success)" : "var(--danger)",
              marginBottom: ".5rem"
            }}>
              {score}
            </div>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              {t("minToPass")} <strong>70</strong>
            </p>

            <div className="grid-2" style={{ marginBottom: "1.5rem" }}>
              <div className="stat-card">
                <span className="stat-value text-success">{correct}</span>
                <span className="stat-label">{t("correct")}</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{total - correct}</span>
                <span className="stat-label">{t("incorrect")}</span>
              </div>
            </div>

            <p style={{ fontSize: ".9rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              {t("timeUsed")} <strong>{formatTime(timeUsed)}</strong> {t("timeOf")} <strong>{formatTime(TIME_LIMIT)}</strong>
            </p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button className="btn btn-outline" onClick={() => {
                setPhase("intro"); setAnswers({}); setCurrent(0); setTimeLeft(TIME_LIMIT); setTimeUp(false)
              }}>
                {t("newSimulacro")}
              </button>
              <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
                {t("toDashboard")}
              </button>
            </div>
          </div>

          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <h3 style={{ marginBottom: "1rem" }}>{t("reviewAnswers")}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {detail.map((item, i) => (
                <div key={i} className="card" style={{
                  borderLeft: `4px solid ${item.is_correct ? "var(--success)" : item.selected ? "var(--danger)" : "var(--text-muted)"}`
                }}>
                  {item.context_text && (
                    <details style={{ marginBottom: ".75rem" }}>
                      <summary style={{ cursor: "pointer", color: "var(--primary)", fontSize: ".85rem", fontWeight: 600 }}>
                        {t("seeContext")}
                      </summary>
                      <div style={{ marginTop: ".5rem", fontSize: ".85rem", lineHeight: "1.6",
                                    whiteSpace: "pre-line", color: "var(--text-muted)" }}>
                        {item.context_text}
                      </div>
                    </details>
                  )}
                  <p style={{ fontWeight: 600, marginBottom: ".75rem" }}>
                    <span style={{ color: "var(--text-muted)", marginRight: ".5rem" }}>{i + 1}.</span>
                    <span>{item.question}</span>
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginBottom: ".5rem" }}>
                    {["A","B","C","D"].map(l => {
                      const txt    = item[`option_${l.toLowerCase()}`]
                      const isSel  = item.selected === l
                      const isCorr = item.correct_answer === l
                      return (
                        <span key={l} style={{
                          padding: ".3rem .75rem", borderRadius: "6px", fontSize: ".85rem",
                          background: isCorr ? "#D1FAE5" : isSel && !isCorr ? "#FEE2E2" : "var(--surface2)",
                          color: isCorr ? "#065F46" : isSel && !isCorr ? "#991B1B" : "var(--text-muted)",
                          fontWeight: (isSel || isCorr) ? 700 : 400,
                          border: `1px solid ${isCorr ? "#6EE7B7" : isSel && !isCorr ? "#FCA5A5" : "var(--border)"}`
                        }}>
                          {l}. {txt}
                          {isCorr && " \u2713"}
                          {isSel && !isCorr && " \u2717"}
                        </span>
                      )
                    })}
                  </div>
                  {!item.selected && (
                    <p style={{ color: "var(--text-muted)", fontSize: ".85rem" }}>{t("unanswered")}</p>
                  )}
                  {item.explanation && (
                    <p style={{ fontSize: ".85rem", color: "var(--text-muted)", marginTop: ".5rem" }}>
                      <strong>{t("explanation")}:</strong> <span>{item.explanation}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    )
  }

  return null
}

export default Simulacro
