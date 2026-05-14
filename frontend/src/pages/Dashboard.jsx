import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../services/api"
import Icon from "../components/Icon"

function getUser() {
  return JSON.parse(localStorage.getItem("user")) || {}
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ user, section, setSection, theme, toggleTheme, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Icon id="flask" size={20} style={{ marginRight: ".4rem" }} />
        Cognia Lab
      </div>

      <div className="navbar-nav">
        {[
          { id: "subjects", label: "Materias",    iconId: "book"      },
          { id: "progress", label: "Progreso",    iconId: "chart"     },
          { id: "news",     label: "Noticias",    iconId: "newspaper" },
        ].map(item => (
          <button
            key={item.id}
            className={`nav-btn ${section === item.id ? "active" : ""}`}
            onClick={() => setSection(item.id)}
          >
            <Icon id={item.iconId} size={16} style={{ marginRight: ".35rem" }} />
            {item.label}
          </button>
        ))}
      </div>

      <div className="navbar-actions">
        <button className="btn btn-ghost btn-sm" onClick={toggleTheme} title={theme === "dark" ? "Modo claro" : "Modo oscuro"}>
          <Icon id={theme === "dark" ? "sun" : "moon"} size={18} />
        </button>
        <span style={{ fontSize: ".9rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: ".3rem" }}>
          <Icon id="user" size={16} />
          {user?.name}
        </span>
        <button className="btn btn-ghost btn-sm" onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: ".3rem" }}>
          <Icon id="logout" size={16} />
          Salir
        </button>
      </div>
    </nav>
  )
}

// ── Dashboard principal ───────────────────────────────────────────────────────
function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getUser())
  const [section, setSection] = useState("subjects")
  const [theme, setTheme] = useState(user.theme || "light")

  useEffect(() => {
    if (!localStorage.getItem("auth")) navigate("/login")
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light"
    setTheme(next)
    const updated = { ...user, theme: next }
    setUser(updated)
    localStorage.setItem("user", JSON.stringify(updated))
  }

  const handleLogout = () => {
    localStorage.removeItem("auth")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="page">
      <Navbar
        user={user}
        section={section}
        setSection={setSection}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />

      <div className="container main-content">
        {/* Saludo */}
        <div className="fade-in" style={{ marginBottom: "2rem" }}>
          <h1 style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            Hola, {user?.name}
            <Icon id="sparkles" size={28} style={{ color: "var(--primary)" }} />
          </h1>
          <p>Practica hoy. Domina el examen.</p>
        </div>

        {section === "subjects"  && <SubjectsSection user={user} navigate={navigate} />}
        {section === "progress"  && <ProgressSection user={user} />}
        {section === "news"      && <NewsSection />}
      </div>
    </div>
  )
}

export default Dashboard

// ── Materias ──────────────────────────────────────────────────────────────────
function SubjectsSection({ user, navigate }) {
  const [subjects, setSubjects] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get("/subjects").then(setSubjects).catch(console.error)
    if (user?.id) {
      api.get(`/stats/${user.id}`).then(setStats).catch(() => {})
    }
  }, [])

  const subjectIcons = ["book", "math", "open-book", "microscope", "globe"]

  return (
    <div className="fade-in">
      {/* Stats rápidas */}
      {stats && (
        <div className="grid-4 mb-2" style={{ marginBottom: "2rem" }}>
          <div className="stat-card">
            <span className="stat-value">{stats.total_attempts}</span>
            <span className="stat-label">Preguntas respondidas</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.correct_answers}</span>
            <span className="stat-label">Respuestas correctas</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.accuracy_percentage}%</span>
            <span className="stat-label">Precisión</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.topics_studied}</span>
            <span className="stat-label">Temas estudiados</span>
          </div>
        </div>
      )}

      <div className="section-header">
        <h2>Materias disponibles</h2>
        <span className="badge badge-primary">{subjects.length} materia{subjects.length !== 1 ? "s" : ""}</span>
      </div>

      {subjects.length === 0 ? (
        <div className="empty-state">
          <div className="icon"><Icon id="book" size={40} /></div>
          <p>Cargando materias...</p>
        </div>
      ) : (
        <div className="grid-3">
          {subjects.map((s, i) => (
            <div
              key={s.id}
              className="subject-card"
              onClick={() => navigate(`/topics/${s.id}`)}
            >
              <Icon id={subjectIcons[i] || "book"} size={40} />
              <h3>{s.name}</h3>
              <p>{s.description || "Prepárate con preguntas tipo bachillerato"}</p>
              <div style={{ marginTop: "auto" }}>
                <span style={{
                  background: "rgba(255,255,255,.2)",
                  padding: ".3rem .8rem",
                  borderRadius: "999px",
                  fontSize: ".8rem",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".3rem"
                }}>
                  Ver temas
                  <Icon id="arrow-right" size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Progreso ──────────────────────────────────────────────────────────────────
function ProgressSection({ user }) {
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    api.get(`/progress/${user.id}`)
      .then(setProgress)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="empty-state"><p>Cargando progreso...</p></div>

  if (!progress || progress.topics?.length === 0) {
    return (
      <div className="empty-state fade-in">
        <div className="icon"><Icon id="chart" size={40} /></div>
        <h3>Sin progreso aún</h3>
        <p>Responde preguntas para ver tu avance aquí</p>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="section-header">
        <h2>Tu progreso</h2>
        <span className="badge badge-primary">Promedio: {progress.overall_percentage}%</span>
      </div>

      {/* Barra general */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div className="flex-between mb-2" style={{ marginBottom: ".75rem" }}>
          <span style={{ fontWeight: 600 }}>Progreso general</span>
          <span className="text-primary fw-bold">{progress.overall_percentage}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress.overall_percentage}%` }} />
        </div>
      </div>

      {/* Por tema */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {progress.topics.map(t => (
          <div key={t.topic_id} className="card">
            <div className="flex-between" style={{ marginBottom: ".5rem" }}>
              <div>
                <h3 style={{ marginBottom: ".2rem" }}>{t.topic_name}</h3>
                <span className="text-muted" style={{ fontSize: ".85rem" }}>{t.subject_name}</span>
              </div>
              <span className="badge badge-primary">{t.completion_percentage}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${t.completion_percentage}%` }} />
            </div>
            <div style={{ display: "flex", gap: "1rem", marginTop: ".75rem", fontSize: ".85rem", color: "var(--text-muted)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: ".3rem" }}>
                <Icon id="check-circle" size={14} style={{ color: "var(--success)" }} />
                {t.correct_count} correctas
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: ".3rem" }}>
                <Icon id="scroll" size={14} />
                {t.total_attempts} intentos
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Noticias ──────────────────────────────────────────────────────────────────
function NewsSection() {
  const news = [
    {
      iconId: "calendar",
      title: "Examen de bachillerato 2025",
      body: "Las pruebas nacionales se realizarán en noviembre. Asegúrate de repasar todos los temas de Estudios Sociales.",
      tag: "Importante"
    },
    {
      iconId: "book",
      title: "Nuevos temas disponibles",
      body: "Ya puedes practicar Historia de Costa Rica, Geografía, Educación Cívica e Historia Universal.",
      tag: "Nuevo"
    },
    {
      iconId: "rocket",
      title: "Próximamente: Simulacros completos",
      body: "Pronto podrás realizar simulacros cronometrados con el formato real del examen de bachillerato.",
      tag: "Próximamente"
    },
    {
      iconId: "robot",
      title: "IA educativa en camino",
      body: "Estamos desarrollando un tutor inteligente que te explicará cada respuesta y adaptará el contenido a tu nivel.",
      tag: "Futuro"
    },
  ]

  const tagColors = {
    "Importante":   "badge-danger",
    "Nuevo":        "badge-success",
    "Próximamente": "badge-warning",
    "Futuro":       "badge-primary"
  }

  return (
    <div className="fade-in">
      <div className="section-header">
        <h2>Noticias y actualizaciones</h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {news.map((n, i) => (
          <div key={i} className="card">
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0, color: "var(--primary)" }}>
                <Icon id={n.iconId} size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".4rem" }}>
                  <h3 style={{ margin: 0 }}>{n.title}</h3>
                  <span className={`badge ${tagColors[n.tag]}`}>{n.tag}</span>
                </div>
                <p>{n.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
