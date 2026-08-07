import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "../services/api"
import Icon from "../components/Icon"
import { useT } from "../i18n.jsx"

const TOPIC_ICONS = ["flag", "map", "scale", "globe", "scroll"]

function Topics() {
  const { subjectId } = useParams()
  const navigate      = useNavigate()
  const user          = JSON.parse(localStorage.getItem("user")) || {}
  const t             = useT()

  const [topics, setTopics]     = useState([])
  const [subject, setSubject]   = useState(null)
  const [progress, setProgress] = useState({})
  const [loading, setLoading]   = useState(true)

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
        progressData.topics.forEach(tp => { map[tp.topic_id] = tp.completion_percentage })
        setProgress(map)
      }
    }).catch(console.error).finally(() => setLoading(false))
  }, [subjectId])

  const statusFor = (pct) => {
    if (pct >= 80) return { label: t("mastered"),   cls: "badge-success" }
    if (pct >= 40) return { label: t("inProgress"), cls: "badge-warning" }
    return               { label: t("notStarted"),  cls: "badge-primary" }
  }

  if (loading) return (
    <div className="flex-center" style={{ minHeight: "100vh" }}><p>{t("loading")}</p></div>
  )

  return (
    <div className="page">
      <nav className="navbar">
        <div className="navbar-brand">
          <Icon id="flask" size={20} style={{ marginRight: ".4rem" }} />
          <span>Cognia Lab</span>
        </div>
        <div className="navbar-actions">
          <span style={{ fontSize: ".9rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: ".3rem" }} className="hide-mobile">
            <Icon id="user" size={16} /><span>{user?.name}</span>
          </span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/dashboard")}>
            {t("dashboard")}
          </button>
        </div>
      </nav>

      <div className="container main-content fade-in">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          {t("backToSubjects")}
        </button>

        <div className="section-header">
          <div>
            <h2>{subject?.name || t("topics")}</h2>
            <p>{subject?.description}</p>
          </div>
          <span className="badge badge-primary">{topics.length} {t("topics").toLowerCase()}</span>
        </div>

        {topics.length === 0 ? (
          <div className="empty-state">
            <div className="icon"><Icon id="folder" size={40} /></div>
            <h3>{t("noQuestions")}</h3>
            <p>{t("noQuestionsDesc")}</p>
          </div>
        ) : (
          <div className="grid-2">
            {topics.map((topic, i) => {
              const pct    = progress[topic.id] || 0
              const status = statusFor(pct)
              return (
                <div key={topic.id} className="topic-card">
                  <div className="flex-between">
                    <Icon id={TOPIC_ICONS[i] || "book"} size={24} style={{ color: "var(--primary)" }} />
                    <span className={`badge ${status.cls}`}>{status.label}</span>
                  </div>
                  <h3>{topic.name}</h3>
                  <p style={{ fontSize: ".9rem" }}>{topic.description}</p>
                  <div>
                    <div className="flex-between" style={{ marginBottom: ".4rem", fontSize: ".85rem" }}>
                      <span className="text-muted">{t("progressLabel")}</span>
                      <span className="text-primary fw-bold">{pct}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div style={{ marginTop: ".5rem", display: "flex", gap: ".5rem" }}>
                    <button className="btn btn-outline btn-sm"
                      style={{ display: "inline-flex", alignItems: "center", gap: ".3rem" }}
                      onClick={() => navigate(`/flashcards/${topic.id}`)}>
                      {pct > 0 ? t("continuePractice") : t("flashcards")}
                      <Icon id="arrow-right" size={14} />
                    </button>
                    <button className="btn btn-sm" style={{
                      display: "inline-flex", alignItems: "center", gap: ".3rem",
                      background: "var(--primary)", color: "#fff", borderRadius: "8px",
                      padding: ".35rem .75rem", fontSize: ".82rem", fontWeight: 600,
                      border: "none", cursor: "pointer"
                    }} onClick={() => navigate(`/questions/${topic.id}?mode=quiz`)}>
                      <Icon id="clock" size={13} /><span>{t("quiz3min")}</span>
                    </button>
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
