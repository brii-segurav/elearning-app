import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "../services/api"
import Icon from "../components/Icon"

function Questions() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user")) || {}

  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem("auth")) { navigate("/login"); return }

    api.get(`/questions/${topicId}`)
      .then(data => setQuestions(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [topicId])

  const currentQ = questions[current]

  const handleSelect = async (letter) => {
    if (result || submitting) return
    setSelected(letter)
    setSubmitting(true)

    try {
      const data = await api.post("/attempt", {
        user_id: user.id,
        question_id: currentQ.id,
        selected_answer: letter
      })
      setResult(data)
      setScore(prev => ({
        correct: prev.correct + (data.is_correct ? 1 : 0),
        total: prev.total + 1
      }))
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

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
    setCurrent(0)
    setSelected(null)
    setResult(null)
    setScore({ correct: 0, total: 0 })
    setFinished(false)
  }

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "100vh" }}>
        <p>Cargando preguntas...</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="page">
        <nav className="navbar">
          <div className="navbar-brand">
            <Icon id="flask" size={20} style={{ marginRight: ".4rem" }} />
            Cognia Lab
          </div>
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
  }

  // ── Pantalla de resultados finales ────────────────────────────────────────
  if (finished) {
    const pct = Math.round((score.correct / score.total) * 100)

    const resultIcon  = pct >= 80 ? "trophy"    : pct >= 60 ? "thumbs-up" : "muscle"
    const msg         = pct >= 80
      ? "¡Excelente dominio del tema!"
      : pct >= 60
      ? "Buen trabajo, sigue practicando"
      : "Sigue practicando, vas a mejorar"

    return (
      <div className="page">
        <nav className="navbar">
          <div className="navbar-brand">
            <Icon id="flask" size={20} style={{ marginRight: ".4rem" }} />
            Cognia Lab
          </div>
        </nav>
        <div className="container main-content">
          <div className="card fade-in" style={{ maxWidth: "520px", margin: "2rem auto", textAlign: "center" }}>
            <div style={{ marginBottom: "1rem", color: "var(--primary)" }}>
              <Icon id={resultIcon} size={64} />
            </div>
            <h2 style={{ marginBottom: ".5rem" }}>Práctica completada</h2>
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
                <Icon id="refresh" size={16} />
                Repetir
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

  return (
    <div className="page">
      <nav className="navbar">
        <div className="navbar-brand">
          <Icon id="flask" size={20} style={{ marginRight: ".4rem" }} />
          Cognia Lab
        </div>
        <div className="navbar-actions">
          <span style={{ fontSize: ".85rem", color: "var(--text-muted)" }}>
            {current + 1} / {questions.length}
          </span>
          <span className="badge badge-success" style={{ display: "inline-flex", alignItems: "center", gap: ".3rem" }}>
            <Icon id="check" size={12} />
            {score.correct}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>Salir</button>
        </div>
      </nav>

      <div className="container main-content">
        <button className="back-btn" onClick={() => navigate(-1)}>← Volver a temas</button>

        {/* Barra de progreso de la sesión */}
        <div style={{ marginBottom: "2rem" }}>
          <div className="flex-between" style={{ marginBottom: ".5rem", fontSize: ".85rem" }}>
            <span className="text-muted">Pregunta {current + 1} de {questions.length}</span>
            <span className={`badge ${diff.cls}`}>{diff.label}</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Tarjeta de pregunta */}
        <div className="card question-card fade-in" key={current}>
          <p className="question-text">{currentQ.question}</p>

          <div className="options-list">
            {options.map(opt => {
              let cls = ""
              if (result) {
                if (opt.letter === result.correct_answer) cls = "correct"
                else if (opt.letter === selected && !result.is_correct) cls = "wrong"
              }

              return (
                <button
                  key={opt.letter}
                  className={`option-btn ${cls}`}
                  onClick={() => handleSelect(opt.letter)}
                  disabled={!!result || submitting}
                >
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

          {/* Explicación */}
          {result && result.explanation && (
            <div className="explanation-box" style={{ display: "flex", gap: ".5rem", alignItems: "flex-start" }}>
              <Icon id="lightbulb" size={16} style={{ marginTop: "2px", flexShrink: 0 }} />
              <div><strong>Explicación:</strong> {result.explanation}</div>
            </div>
          )}

          {/* Feedback y botón siguiente */}
          {result && (
            <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{
                fontWeight: 700,
                color: result.is_correct ? "var(--success)" : "var(--danger)",
                fontSize: "1rem",
                display: "inline-flex",
                alignItems: "center",
                gap: ".4rem"
              }}>
                {result.is_correct
                  ? <><Icon id="check-circle" size={18} /> ¡Correcto!</>
                  : <><Icon id="x-mark" size={18} /> Incorrecto</>
                }
              </span>
              <button className="btn btn-primary" onClick={handleNext}
                style={{ display: "inline-flex", alignItems: "center", gap: ".4rem" }}>
                {current + 1 >= questions.length ? "Ver resultados" : "Siguiente"}
                <Icon id="arrow-right" size={16} />
              </button>
            </div>
          )}

          {submitting && (
            <div style={{ marginTop: "1rem", textAlign: "center", color: "var(--text-muted)" }}>
              Verificando...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Questions
