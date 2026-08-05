import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "../services/api"
import Icon from "../components/Icon"

function Flashcards() {
  const { topicId }  = useParams()
  const navigate     = useNavigate()

  const [cards, setCards]       = useState([])
  const [current, setCurrent]   = useState(0)
  const [flipped, setFlipped]   = useState(false)
  const [loading, setLoading]   = useState(true)
  const [known, setKnown]       = useState(new Set())
  const [reviewing, setReviewing] = useState(false)  // repasando solo las difíciles
  const [done, setDone]         = useState(false)

  useEffect(() => {
    if (!localStorage.getItem("auth")) { navigate("/login"); return }
    api.get(`/questions/${topicId}`)
      .then(data => setCards(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [topicId])

  const activeCards = reviewing
    ? cards.filter(c => !known.has(c.id))
    : cards

  const card = activeCards[current]

  const handleFlip = async () => {
    if (!flipped && !card.reveal) {
      try {
        const u = JSON.parse(localStorage.getItem("user")) || {}
        const data = await api.post("/attempt", {
          user_id:         u.id || 0,
          question_id:     card.id,
          selected_answer: "A"
        })
        const correctLetter = data.correct_answer
        const correctText   = card[`option_${correctLetter.toLowerCase()}`]
        setCards(prev => prev.map(c =>
          c.id === card.id
            ? { ...c, reveal: { letter: correctLetter, text: correctText, explanation: data.explanation } }
            : c
        ))
      } catch { /* silencioso */ }
    }
    setFlipped(f => !f)
  }

  const handleKnow = () => {
    setKnown(prev => new Set([...prev, card.id]))
    setFlipped(false)
    if (current + 1 >= activeCards.length) {
      setDone(true)
    } else {
      setCurrent(c => c + 1)
    }
  }

  const handleDontKnow = () => {
    setFlipped(false)
    if (current + 1 >= activeCards.length) {
      setDone(true)
    } else {
      setCurrent(c => c + 1)
    }
  }

  const handleRestart = () => {
    setCurrent(0); setFlipped(false); setKnown(new Set())
    setDone(false); setReviewing(false)
  }

  const handleReviewWeak = () => {
    setCurrent(0); setFlipped(false); setDone(false); setReviewing(true)
  }

  if (loading) return (
    <div className="flex-center" style={{ minHeight: "100vh" }}>
      <p>Cargando flashcards...</p>
    </div>
  )

  if (cards.length === 0) return (
    <div className="page">
      <nav className="navbar">
        <div className="navbar-brand">
          <Icon id="flask" size={20} style={{ marginRight: ".4rem" }} />
          <span>Cognia Lab</span>
        </div>
      </nav>
      <div className="container main-content">
        <button className="back-btn" onClick={() => navigate(-1)}>← Volver</button>
        <div className="empty-state">
          <div className="icon"><Icon id="question" size={40} /></div>
          <h3>Sin contenido disponible</h3>
          <p>Este tema aún no tiene preguntas cargadas</p>
        </div>
      </div>
    </div>
  )

  // ── Pantalla final ────────────────────────────────────────────────────────
  if (done) {
    const weak = cards.length - known.size
    return (
      <div className="page">
        <nav className="navbar">
          <div className="navbar-brand">
            <Icon id="flask" size={20} style={{ marginRight: ".4rem" }} />
            <span>Cognia Lab</span>
          </div>
        </nav>
        <div className="container main-content">
          <div className="card fade-in" style={{ maxWidth: "480px", margin: "2rem auto", textAlign: "center" }}>
            <div style={{ color: "var(--primary)", marginBottom: "1rem" }}>
              <Icon id={known.size === cards.length ? "trophy" : "thumbs-up"} size={56} />
            </div>
            <h2 style={{ marginBottom: ".5rem" }}>
              {reviewing ? "Repaso completado" : "Mazo completado"}
            </h2>
            <p style={{ marginBottom: "2rem" }}>
              {known.size === cards.length
                ? "¡Excelente! Dominaste todas las tarjetas."
                : `Dominaste ${known.size} de ${cards.length} tarjetas.`}
            </p>

            <div className="grid-2" style={{ marginBottom: "2rem" }}>
              <div className="stat-card">
                <span className="stat-value text-success">{known.size}</span>
                <span className="stat-label">Dominadas</span>
              </div>
              <div className="stat-card">
                <span className="stat-value" style={{ color: weak > 0 ? "var(--danger)" : "var(--success)" }}>
                  {weak}
                </span>
                <span className="stat-label">Por repasar</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
              {weak > 0 && (
                <button className="btn btn-primary" onClick={handleReviewWeak}>
                  Repasar las {weak} difíciles
                </button>
              )}
              <button className="btn btn-outline" onClick={handleRestart}>
                Reiniciar mazo completo
              </button>
              <button className="btn btn-ghost" onClick={() => navigate(-1)}>
                ← Volver a temas
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Flashcard activa ──────────────────────────────────────────────────────
  const progress = Math.round((current / activeCards.length) * 100)

  return (
    <div className="page">
      <nav className="navbar">
        <div className="navbar-brand">
          <Icon id="flask" size={20} style={{ marginRight: ".4rem" }} />
          <span>Cognia Lab</span>
        </div>
        <div className="navbar-actions">
          <span style={{ fontSize: ".85rem", color: "var(--text-muted)" }}>
            <span>{current + 1}</span> / <span>{activeCards.length}</span>
            {reviewing && <span style={{ marginLeft: ".5rem", color: "var(--warning)" }}>(repaso)</span>}
          </span>
          <span className="badge badge-success" style={{ display: "inline-flex", alignItems: "center", gap: ".3rem" }}>
            <Icon id="check" size={12} />
            <span>{known.size}</span>
          </span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>Salir</button>
        </div>
      </nav>

      <div className="container main-content" style={{ maxWidth: "680px" }}>
        <button className="back-btn" onClick={() => navigate(-1)}>← Volver a temas</button>

        {/* Barra de progreso */}
        <div style={{ marginBottom: "2rem" }}>
          <div className="flex-between" style={{ marginBottom: ".5rem", fontSize: ".85rem" }}>
            <span className="text-muted">
              Tarjeta <strong>{current + 1}</strong> de <strong>{activeCards.length}</strong>
            </span>
            <span className="text-primary fw-bold">{progress}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%`, transition: "width 0.3s ease" }} />
          </div>
        </div>

        {/* Texto de contexto (si existe) */}
        {card.context_text && !flipped && (
          <div className="card" style={{
            marginBottom: "1.25rem",
            background: "var(--surface-2)",
            borderLeft: "4px solid var(--primary)",
            fontSize: ".92rem", lineHeight: "1.7"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem",
                          marginBottom: ".75rem", fontWeight: 600, color: "var(--primary)" }}>
              <Icon id="scroll" size={16} />
              <span>Texto de referencia</span>
            </div>
            <div style={{ whiteSpace: "pre-line" }}>{card.context_text}</div>
          </div>
        )}

        {/* Tarjeta con flip */}
        <div
          onClick={handleFlip}
          style={{
            cursor: "pointer",
            minHeight: "220px",
            borderRadius: "16px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            background: flipped
              ? "linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)"
              : "var(--surface)",
            color: flipped ? "#fff" : "var(--text)",
            border: `2px solid ${flipped ? "transparent" : "var(--border)"}`,
            boxShadow: "0 4px 24px rgba(79,70,229,.12)",
            transition: "background 0.3s ease, color 0.3s ease",
            marginBottom: "1.5rem",
            userSelect: "none"
          }}
        >
          <div style={{ fontSize: ".8rem", fontWeight: 600, opacity: .7, marginBottom: "1rem",
                        textTransform: "uppercase", letterSpacing: ".08em" }}>
            {flipped ? "Respuesta" : "Pregunta — toca para revelar"}          </div>

          {flipped ? (
            <div style={{ fontSize: "1rem", lineHeight: "1.6", width: "100%" }}>
              <div style={{ fontSize: ".8rem", fontWeight: 600, opacity: .7,
                            textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "1rem" }}>
                Respuesta correcta
              </div>
              {card.reveal ? (
                <>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: ".75rem" }}>
                    {card.reveal.letter}. {card.reveal.text}
                  </div>
                  {card.reveal.explanation && (
                    <div style={{ opacity: .85, fontSize: ".9rem" }}>
                      {card.reveal.explanation}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ opacity: .7 }}>Cargando respuesta...</div>
              )}
            </div>
          ) : (
            <p style={{ fontSize: "1.05rem", lineHeight: "1.6", fontWeight: 500 }}>
              {card.question}
            </p>
          )}
        </div>

        {/* Hint de opciones (frente de la tarjeta) */}
        {!flipped && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem",
                        justifyContent: "center", marginBottom: "1.5rem" }}>
            {["A","B","C","D"].map(l => (
              <span key={l} style={{
                padding: ".3rem .75rem", borderRadius: "6px",
                background: "var(--surface-2)", fontSize: ".85rem",
                color: "var(--text-muted)", border: "1px solid var(--border)"
              }}>
                {l}. {card[`option_${l.toLowerCase()}`]}
              </span>
            ))}
          </div>
        )}

        {/* Botones de conocimiento (solo cuando está volteada) */}
        {flipped && (
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button
              className="btn"
              onClick={handleDontKnow}
              style={{
                flex: 1, maxWidth: "200px",
                background: "#FEE2E2", color: "#991B1B", border: "none",
                borderRadius: "10px", padding: ".85rem", fontWeight: 700,
                fontSize: ".95rem", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem"
              }}
            >
              <Icon id="x-mark" size={18} />
              <span>No lo sé</span>
            </button>
            <button
              className="btn"
              onClick={handleKnow}
              style={{
                flex: 1, maxWidth: "200px",
                background: "#D1FAE5", color: "#065F46", border: "none",
                borderRadius: "10px", padding: ".85rem", fontWeight: 700,
                fontSize: ".95rem", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem"
              }}
            >
              <Icon id="check-circle" size={18} />
              <span>Lo sé</span>
            </button>
          </div>
        )}

        {!flipped && (
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: ".85rem", marginTop: ".5rem" }}>
            Toca la tarjeta para ver la respuesta
          </p>
        )}
      </div>
    </div>
  )
}

export default Flashcards
