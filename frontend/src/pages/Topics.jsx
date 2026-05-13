import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "../services/api"

function Topics() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user")) || {}

  const [topics, setTopics] = useState([])
  const [subject, setSubject] = useState(null)
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem("auth")) { navigate("/login"); return }

    Promise.all([
      api.get(`/topics/${subjectId}`),
      api.get("/subjects"),
      user?.id ? api.get(`/progress/${user.id}`) : Promise.resolve(null)
    ]).then(([topicsData, subjectsData, progressData]) => {
      setTopics(topicsData)
      setSubject(subjectsData.find(s => s.id === parseInt(subjectId)))

      if (progressData?.topics) {
        const map = {}
        progressData.topics.forEach(t => { map[t.topic_id] = t.completion_percentage })
        setProgress(map)
      }
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [subjectId])

  const difficultyLabel = (pct) => {
    if (pct >= 80) return { label: "Dominado", cls: "badge-success" }
    if (pct >= 40) return { label: "En progreso", cls: "badge-warning" }
    return { label: "Sin iniciar", cls: "badge-primary" }
  }

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "100vh" }}>
        <p>Cargando temas...</p>
      </div>
    )
  }

  return (
    <div className="page">
      {/* Navbar mínimo */}
      <nav className="navbar">
        <div className="navbar-brand">🧪 Cognia Lab</div>
        <div className="navbar-actions">
          <span style={{ fontSize: ".9rem", color: "var(--text-muted)" }}>👤 {user?.name}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
        </div>
      </nav>

      <div className="container main-content fade-in">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Volver a materias
        </button>

        <div className="section-header">
          <div>
            <h2>{subject?.name || "Temas"}</h2>
            <p>{subject?.description}</p>
          </div>
          <span className="badge badge-primary">{topics.length} temas</span>
        </div>

        {topics.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📂</div>
            <h3>Sin temas disponibles</h3>
            <p>Próximamente se agregarán temas a esta materia</p>
          </div>
        ) : (
          <div className="grid-2">
            {topics.map((topic, i) => {
              const pct = progress[topic.id] || 0
              const status = difficultyLabel(pct)
              return (
                <div
                  key={topic.id}
                  className="topic-card"
                  onClick={() => navigate(`/questions/${topic.id}`)}
                >
                  <div className="flex-between">
                    <span style={{ fontSize: "1.5rem" }}>
                      {["🏛️", "🗺️", "⚖️", "🌐", "📜"][i] || "📖"}
                    </span>
                    <span className={`badge ${status.cls}`}>{status.label}</span>
                  </div>

                  <h3>{topic.name}</h3>
                  <p style={{ fontSize: ".9rem" }}>{topic.description}</p>

                  <div>
                    <div className="flex-between" style={{ marginBottom: ".4rem", fontSize: ".85rem" }}>
                      <span className="text-muted">Progreso</span>
                      <span className="text-primary fw-bold">{pct}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div style={{ marginTop: ".5rem" }}>
                    <span className="btn btn-outline btn-sm">
                      {pct > 0 ? "Continuar práctica →" : "Comenzar →"}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Topics
