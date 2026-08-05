import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../services/api"
import Icon from "../components/Icon"
import { useTranslation, notifyLanguageChange } from "../i18n"

function getUser() {
  return JSON.parse(localStorage.getItem("user")) || {}
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ user, section, setSection, theme, toggleTheme, onLogout }) {
  const t = useTranslation()
  const navItems = [
    { id: "subjects", labelKey: "subjects",  iconId: "book"      },
    { id: "progress", labelKey: "progress",  iconId: "chart"     },
    { id: "news",     labelKey: "news",      iconId: "newspaper" },
    { id: "account",  labelKey: "myAccount", iconId: "user"      },
  ]
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Icon id="flask" size={20} style={{ marginRight: ".4rem" }} />
        Cognia Lab
      </div>
      <div className="navbar-nav">
        {navItems.map(item => (
          <button key={item.id} className={`nav-btn ${section === item.id ? "active" : ""}`}
            onClick={() => setSection(item.id)}>
            <Icon id={item.iconId} size={16} style={{ marginRight: ".35rem" }} />
            {t(item.labelKey)}
          </button>
        ))}
      </div>
      <div className="navbar-actions">
        <button className="btn btn-ghost btn-sm" onClick={toggleTheme}>
          <Icon id={theme === "dark" ? "sun" : "moon"} size={18} />
        </button>
        <span style={{ fontSize: ".9rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: ".3rem" }} className="hide-mobile">
          <Icon id="user" size={16} />
          <span>{user?.name}</span>
        </span>
        <button className="btn btn-ghost btn-sm" onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: ".3rem" }}>
          <Icon id="logout" size={16} />
          <span className="hide-mobile">{t("logout")}</span>
        </button>
      </div>
    </nav>
  )
}

// ── Dashboard principal ───────────────────────────────────────────────────────
function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser]       = useState(getUser())
  const [section, setSection] = useState("subjects")
  const [theme, setTheme]     = useState(user.theme || "light")
  const t = useTranslation()

  useEffect(() => { if (!localStorage.getItem("auth")) navigate("/login") }, [])
  useEffect(() => { document.documentElement.setAttribute("data-theme", theme) }, [theme])

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
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className="page">
      <Navbar user={user} section={section} setSection={setSection}
        theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} />
      <div className="container main-content">
        <div className="fade-in" style={{ marginBottom: "2rem" }}>
          <h1 style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <span>{t("hello")}, {user?.name}</span>
            <Icon id="sparkles" size={28} style={{ color: "var(--primary)" }} />
          </h1>
          <p>{t("practiceToday")}</p>
        </div>
        {section === "subjects" && <SubjectsSection user={user} navigate={navigate} />}
        {section === "progress" && <ProgressSection user={user} />}
        {section === "news"     && <NewsSection />}
        {section === "account"  && <AccountSection user={user} setUser={setUser} setTheme={setTheme} />}
      </div>
    </div>
  )
}

export default Dashboard

// ── Materias ──────────────────────────────────────────────────────────────────
function SubjectsSection({ user, navigate }) {
  const t = useTranslation()
  const [subjects, setSubjects] = useState([])
  const [stats, setStats]       = useState(null)

  useEffect(() => {
    api.get("/subjects").then(setSubjects).catch(console.error)
    if (user?.id) api.get(`/stats/${user.id}`).then(setStats).catch(() => {})
  }, [])

  const subjectIcons = ["book", "math", "open-book", "microscope", "globe"]

  return (
    <div className="fade-in">
      {stats && (
        <div className="grid-4" style={{ marginBottom: "2rem" }}>
          <div className="stat-card">
            <span className="stat-value">{stats.total_attempts}</span>
            <span className="stat-label">{t("questionsAnswered")}</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.correct_answers}</span>
            <span className="stat-label">{t("correctAnswers")}</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.accuracy_percentage}%</span>
            <span className="stat-label">{t("accuracy")}</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.topics_studied}</span>
            <span className="stat-label">{t("topicsStudied")}</span>
          </div>
        </div>
      )}

      <div className="section-header">
        <h2>{t("availableSubjects")}</h2>
        <span className="badge badge-primary">
          {subjects.length} {subjects.length !== 1 ? t("subjects_plural") : t("subject")}
        </span>
      </div>

      {/* Banner simulacro */}
      <div className="card" style={{
        marginBottom: "1.5rem", cursor: "pointer",
        background: "linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)", color: "#fff"
      }} onClick={() => navigate("/simulacro")}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Icon id="scroll" size={36} />
            <div>
              <h3 style={{ color: "#fff", marginBottom: ".25rem" }}>{t("simulacroMEP")}</h3>
              <p style={{ opacity: .85, fontSize: ".9rem", margin: 0 }}>{t("simulacroDesc")}</p>
            </div>
          </div>
          <Icon id="arrow-right" size={24} />
        </div>
      </div>

      {subjects.length === 0 ? (
        <div className="empty-state">
          <div className="icon"><Icon id="book" size={40} /></div>
          <p>{t("loading")}</p>
        </div>
      ) : (
        <div className="grid-3">
          {subjects.map((s, i) => (
            <div key={s.id} className="subject-card" onClick={() => navigate(`/topics/${s.id}`)}>
              <Icon id={subjectIcons[i] || "book"} size={40} />
              <h3>{s.name}</h3>
              <p>{s.description || t("simulacroDesc")}</p>
              <div style={{ marginTop: "auto" }}>
                <span style={{
                  background: "rgba(255,255,255,.2)", padding: ".3rem .8rem",
                  borderRadius: "999px", fontSize: ".8rem", fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: ".3rem"
                }}>
                  {t("topics")} <Icon id="arrow-right" size={14} />
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
  const t = useTranslation()
  const [progress, setProgress] = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (!user?.id) return
    api.get(`/progress/${user.id}`).then(setProgress).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="empty-state"><p>{t("loading")}</p></div>
  if (!progress || progress.topics?.length === 0) return (
    <div className="empty-state fade-in">
      <div className="icon"><Icon id="chart" size={40} /></div>
      <h3>{t("noProgress")}</h3>
      <p>{t("noProgressDesc")}</p>
    </div>
  )

  return (
    <div className="fade-in">
      <div className="section-header">
        <h2>{t("yourProgress")}</h2>
        <span className="badge badge-primary">{t("average")}: {progress.overall_percentage}%</span>
      </div>
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div className="flex-between" style={{ marginBottom: ".75rem" }}>
          <span style={{ fontWeight: 600 }}>{t("yourProgress")}</span>
          <span className="text-primary fw-bold">{progress.overall_percentage}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress.overall_percentage}%` }} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {progress.topics.map(topic => (
          <div key={topic.topic_id} className="card">
            <div className="flex-between" style={{ marginBottom: ".5rem" }}>
              <div>
                <h3 style={{ marginBottom: ".2rem" }}>{topic.topic_name}</h3>
                <span className="text-muted" style={{ fontSize: ".85rem" }}>{topic.subject_name}</span>
              </div>
              <span className="badge badge-primary">{topic.completion_percentage}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${topic.completion_percentage}%` }} />
            </div>
            <div style={{ display: "flex", gap: "1rem", marginTop: ".75rem", fontSize: ".85rem", color: "var(--text-muted)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: ".3rem" }}>
                <Icon id="check-circle" size={14} style={{ color: "var(--success)" }} />
                {topic.correct_count} {t("correct").toLowerCase()}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: ".3rem" }}>
                <Icon id="scroll" size={14} />
                {topic.total_attempts}
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
  const t = useTranslation()
  const news = [
    { iconId: "calendar", title: t("newsTitle"), body: "Las pruebas nacionales se realizarán en noviembre.", tag: "Importante" },
    { iconId: "book",     title: t("availableSubjects"), body: "Ya puedes practicar Historia, Geografía, Cívica e Historia Universal.", tag: "Nuevo" },
    { iconId: "rocket",   title: t("simulacroMEP"), body: t("simulacroDesc"), tag: "Próximamente" },
    { iconId: "robot",    title: "IA educativa", body: "Tutor inteligente que adaptará el contenido a tu nivel.", tag: "Futuro" },
  ]
  const tagColors = { "Importante": "badge-danger", "Nuevo": "badge-success", "Próximamente": "badge-warning", "Futuro": "badge-primary" }

  return (
    <div className="fade-in">
      <div className="section-header"><h2>{t("newsTitle")}</h2></div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {news.map((n, i) => (
          <div key={i} className="card">
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0, color: "var(--primary)" }}><Icon id={n.iconId} size={28} /></div>
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

// ── Mi cuenta ─────────────────────────────────────────────────────────────────
function AccountSection({ user, setUser, setTheme }) {
  const t = useTranslation()
  const [form, setForm] = useState({
    name:      user.name      || "",
    last_name: user.last_name || "",
    country:   user.country   || "",
    language:  user.language  || "es",
    theme:     user.theme     || "light",
  })
  const [saved, setSaved] = useState(false)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSave = (e) => {
    e.preventDefault()
    const updated = { ...user, ...form }
    localStorage.setItem("user", JSON.stringify(updated))
    setUser(updated)
    setTheme(form.theme)
    document.documentElement.setAttribute("data-theme", form.theme)
    notifyLanguageChange()   // ← reactiva todas las traducciones
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="fade-in" style={{ maxWidth: "580px" }}>
      <div className="section-header"><h2>{t("myAccountTitle")}</h2></div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", background: "var(--primary)", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.4rem", fontWeight: 700, flexShrink: 0
          }}>
            {user.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>
              <span>{user.name}</span> <span>{user.last_name}</span>
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: ".9rem" }}>{user.email}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSave}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">{t("name")}</label>
              <input className="input" value={form.name} onChange={set("name")} required />
            </div>
            <div className="form-group">
              <label className="form-label">{t("lastName")}</label>
              <input className="input" value={form.last_name} onChange={set("last_name")} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t("country")}</label>
            <input className="input" value={form.country} onChange={set("country")} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">{t("language")}</label>
              <select className="input" value={form.language} onChange={set("language")}>
                <option value="es">{t("spanish")}</option>
                <option value="en">{t("english")}</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t("theme")}</label>
              <select className="input" value={form.theme} onChange={set("theme")}>
                <option value="light">{t("lightTheme")}</option>
                <option value="dark">{t("darkTheme")}</option>
              </select>
            </div>
          </div>

          {saved && (
            <div style={{
              padding: ".75rem 1rem", background: "#D1FAE5", color: "#065F46",
              borderRadius: "8px", fontSize: ".9rem", marginBottom: "1rem",
              display: "flex", alignItems: "center", gap: ".5rem"
            }}>
              <Icon id="check-circle" size={16} />
              <span>{t("savedOk")}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary">{t("saveChanges")}</button>
        </form>
      </div>
    </div>
  )
}
