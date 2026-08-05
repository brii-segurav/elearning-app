import { useEffect, useState, useCallback } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { api } from "../services/api"
import Icon from "../components/Icon"

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0")
  const s = (sec % 60).toString().padStart(2, "0")
  return `${m}:${s}`
}

function Questions() {
  const { topicId }        = useParams()
  const [searchParams]     = useSearchParams()
  const isQuiz             = searchParams.get("mode") === "quiz"
  const navigate           = useNavigate()
  const user               = JSON.parse(localStorage.getItem("user")) || {}

  const [questions, setQuestions]   = useState([])
  const [current, setCurrent]       = useState(0)
  const [selected, setSelected]     = useState(null)
  const [result, setResult]         = useState(null)
  const [loading, setLoading]       = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [score, setScore]           = useState({ correct: 0, total: 0 })
  const [finished, setFinished]     = useState(false)
  const [timeLeft, setTimeLeft]     = useState(isQuiz ? 180 : null)
  const [timePassed, setTimePassed] = useState(0)
  const [timeUp, setTimeUp]         = useState(false)
  const startTime                   = useState(() => Date.now())[0]

  // ── Cargar preguntas ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!localStorage.getItem("auth")) { navigate("/login"); return }
    const endpoint = isQuiz ? `/quiz/${topicId}` : `/questions/${topicId}`
    api.get(endpoint)
      .then(data => setQuestions(isQuiz ? data.questions : data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [topicId, isQuiz])

  // ── Cronómetro (solo en modo quiz) ────────────────────────────────────────
  useEffect(() => {
    if (!isQuiz || finished || timeUp) return
    if (timeLeft <= 0) { setTimeUp(true); setFinished(true); return }
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(id); setTimeUp(true); setFinished(true); return 0 }
        return t - 1
      })
      setTimePassed(p => p + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [isQuiz, finished, timeUp, timeLeft])

  const currentQ = questions[current]

  const handleSelect = useCallback(async (letter) => {
    if (result || submitting || timeUp) return
    setSelected(letter)
    setSubmitting(true)
    try {
      const data = await api.post("/attempt", {
        user_id:         user.id,
        question_id:     currentQ.id,
        selected_answer: letter
      })
      setResult(data)
      setScore(prev => ({
        correct: prev.correct + (data.is_correct ? 1 : 0),
        total:   prev.total + 1
      }))
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }, [result, submitting, timeUp, currentQ, user.id])

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setResult(null)
    }
  }

  const handleRestart = () => {
    setCurrent(0); setSelected(null); setResult(null)
    setScore({ correct: 0, total: 0 }); setFinished(false)
    setTimeLeft(isQuiz ? 180 : null); setTimePassed(0); setTimeUp(false)
  }

  if (loading) return (
    <div className="flex-center" style={{ minHeight: "100vh" }}>
      <p>Cargando preguntas...</p>
    </div>
  )

  if (questions.length === 0) return (
    <div className="page">
      <nav className="navbar">
        <div className="navbar-brand"><Icon id="flask" size={20} style={{ marginRight: ".4rem" }} />Cognia Lab</div>
      </nav>
      <div className="container main-content">
        <button className="back-btn" onClick={() => navigate(-1)}>← Volver</button>
        <div className="empty-state">
          <div className="icon"><Icon id="question" size={40} /></div>
          <h3>Sin preguntas disponibles</h3>
          <p>Este tema aún no tiene preguntas cargadas</p>
        </div>
      </div>
    </div>
  )

  // ── Pantalla de resultados ────────────────────────────────────────────────
  if (finished) {
    const pct         = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0
    const resultIcon  = pct >= 80 ? "trophy" : pct >= 60 ? "thumbs-up" : "muscle"
    const msg         = pct >= 80 ? "¡Excelente dominio del tema!"
                      : pct >= 60 ? "Buen trabajo, sigue practicando"
                      : "Sigue practicando, vas a mejorar"

    return (
      <div className="page">
        <nav className="navbar">
          <div className="navbar-brand"><Icon id="flask" size={20} style={{ marginRight: ".4rem" }} />Cognia Lab</div>
        </nav>
        <div className="container main-content">
          <div className="card fade-in" style={{ maxWidth: "520px", margin: "2rem auto", textAlign: "center" }}>
            {timeUp && (
              <div style={{ background: "#FEE2E2", color: "#991B1B", borderRadius: "8px",
                            padding: ".75rem 1rem", marginBottom: "1rem", fontWeight: 600 }}>
                <Icon id="warning" size={16} /> <span>¡Se acabó el tiempo!</span>
              </div>
            )}
            <div style={{ marginBottom: "1rem", color: "var(--primary)" }}>
              <Icon id={resultIcon} size={64} />
            </div>
            <h2 style={{ marginBottom: ".5rem" }}>{isQuiz ? "Quiz completado" : "Práctica completada"}</h2>
            <p style={{ marginBottom: "2rem" }}>{msg}</p>

            <div className="grid-2" style={{ marginBottom: "2rem" }}>
              <div className="stat-card" style={{ textAlign: "center" }}>
                <span className="stat-value text-success">{score.correct}</span>
                <span className="stat-label">Correctas</span>
              </div>
              <div className="stat-card" style={{ textAlign: "center" }}>
                <span className="stat-value">{score.total - score.correct}</span>
                <span className="stat-label">Incorrectas</span>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <div className="flex-between" style={{ marginBottom: ".5rem" }}>
                <span>Puntuación</span>
                <span className="fw-bold text-primary">{pct}%</span>
              </div>
              <div className="progress-track" style={{ height: "12px" }}>
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button className="btn btn-outline" onClick={handleRestart}
                style={{ display: "inline-flex", alignItems: "center", gap: ".4rem" }}>
                <Icon id="refresh" size={16} /><span>Repetir</span>
              </button>
              <button className="btn btn-primary" onClick={() => navigate(-1)}>
                ← Volver a temas
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Pregunta activa ───────────────────────────────────────────────────────
  const options = [
    { letter: "A", text: currentQ.option_a },
    { letter: "B", text: currentQ.option_b },
    { letter: "C", text: currentQ.option_c },
    { letter: "D", text: currentQ.option_d },
  ]
  const diffBadge = {
    easy:   { label: "Fácil",   cls: "badge-success" },
    medium: { label: "Medio",   cls: "badge-warning" },
    hard:   { label: "Difícil", cls: "badge-danger"  },
  }
  const diff = diffBadge[currentQ.difficulty] || diffBadge.medium
  const timerWarning = isQuiz && timeLeft <= 30

  return (
    <div className="page">
      <nav className="navbar">
        <div className="navbar-brand">
          <Icon id="flask" size={20} style={{ marginRight: ".4rem" }} />
          <span>Cognia Lab</span>
        </div>
        <div className="navbar-actions">
          {isQuiz && (
            <span style={{
              fontWeight: 700, fontSize: "1rem", fontFamily: "monospace",
              color: timerWarning ? "var(--danger)" : "var(--text)",
              background: timerWarning ? "#FEE2E2" : "var(--surface-2)",
              padding: ".3rem .75rem", borderRadius: "8px",
              display: "inline-flex", alignItems: "center", gap: ".4rem"
            }}>
              <Icon id="clock" size={16} />
              <span>{formatTime(timeLeft)}</span>
            </span>
          )}
          <span style={{ fontSize: ".85rem", color: "var(--text-muted)" }}>
            <span>{current + 1}</span> / <span>{questions.length}</span>
          </span>
          <span className="badge badge-success" style={{ display: "inline-flex", alignItems: "center", gap: ".3rem" }}>
            <Icon id="check" size={12} />
            <span>{score.correct}</span>
          </span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>Salir</button>
        </div>
      </nav>

      <div className="container main-content">
        <button className="back-btn" onClick={() => navigate(-1)}>← Volver a temas</button>

        {/* Barra de progreso */}
        <div style={{ marginBottom: "2rem" }}>
          <div className="flex-between" style={{ marginBottom: ".5rem", fontSize: ".85rem" }}>
            <span className="text-muted">
              Pregunta <strong>{current + 1}</strong> de <strong>{questions.length}</strong>
            </span>
            <span className={`badge ${diff.cls}`}>{diff.label}</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{
              width: `${(current / questions.length) * 100}%`,
              transition: "width 0.3s ease"
            }} />
          </div>
        </div>

        {/* Texto de contexto MEP */}
        {currentQ.context_text && (
          <div className="card" style={{
            marginBottom: "1.25rem",
            background: "var(--surface-2)",
            borderLeft: "4px solid var(--primary)",
            fontSize: ".92rem",
            lineHeight: "1.7"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem",
                          marginBottom: ".75rem", fontWeight: 600, color: "var(--primary)" }}>
              <Icon id="scroll" size={16} />
              <span>Lea el siguiente texto y responda:</span>
            </div>
            <div style={{ whiteSpace: "pre-line" }}>{currentQ.context_text}</div>
          </div>
        )}

        {/* Tarjeta de pregunta */}
        <div className="card question-card fade-in">
          <p className="question-text">{currentQ.question}</p>

          <div className="options-list">
            {options.map(opt => {
              let cls = ""
              if (result) {
                if (opt.letter === result.correct_answer) cls = "correct"
                else if (opt.letter === selected && !result.is_correct) cls = "wrong"
              }
              return (
                <button key={opt.letter} className={`option-btn ${cls}`}
                  onClick={() => handleSelect(opt.letter)}
                  disabled={!!result || submitting || timeUp}>
                  <span className="option-letter">{opt.letter}</span>
                  <span>{opt.text}</span>
                  {result && opt.letter === result.correct_answer && (
                    <span style={{ marginLeft: "auto", color: "var(--success)" }}>
                      <Icon id="check-circle" size={18} />
                    </span>
                  )}
                  {result && opt.letter === selected && !result.is_correct && opt.letter !== result.correct_answer && (
                    <span style={{ marginLeft: "auto", color: "var(--danger)" }}>
                      <Icon id="x-mark" size={18} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {result && result.explanation && (
            <div className="explanation-box" style={{ display: "flex", gap: ".5rem", alignItems: "flex-start" }}>
              <Icon id="lightbulb" size={16} style={{ marginTop: "2px", flexShrink: 0 }} />
              <div><strong>Explicación:</strong> <span>{result.explanation}</span></div>
            </div>
          )}

          {result && (
            <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{
                fontWeight: 700, fontSize: "1rem",
                color: result.is_correct ? "var(--success)" : "var(--danger)",
                display: "inline-flex", alignItems: "center", gap: ".4rem"
              }}>
                {result.is_correct
                  ? <><Icon id="check-circle" size={18} /><span>¡Correcto!</span></>
                  : <><Icon id="x-mark" size={18} /><span>Incorrecto</span></>}
              </span>
              <button className="btn btn-primary" onClick={handleNext}
                style={{ display: "inline-flex", alignItems: "center", gap: ".4rem" }}>
                <span>{current + 1 >= questions.length ? "Ver resultados" : "Siguiente"}</span>
                <Icon id="arrow-right" size={16} />
              </button>
            </div>
          )}

          {submitting && (
            <div style={{ marginTop: "1rem", textAlign: "center", color: "var(--text-muted)" }}>
              <span>Verificando...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Questions
