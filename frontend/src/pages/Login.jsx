import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../services/api"
import Icon from "../components/Icon"
import { useT } from "../i18n.jsx"

function Login() {
  const navigate = useNavigate()
  const t        = useT()
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(""); setLoading(true)
    try {
      const data = await api.post("/login", { email, password })
      console.log("Login response:", data)
      if (data.token) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("auth", "true")
        localStorage.setItem("user", JSON.stringify(data.user))
        document.documentElement.setAttribute("data-theme", data.user.theme || "light")
        navigate("/dashboard")
      } else {
        setError(data.error || "Error al iniciar sesión")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("No se pudo conectar con el servidor")
    } finally { setLoading(false) }
  }

  const features = [
    { iconId: "book",         label: "Estudios Sociales" },
    { iconId: "chart",        label: t("yourProgress") },
    { iconId: "check-circle", label: t("questions50") },
  ]

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <Icon id="flask" size={64} style={{ color: "#fff", marginBottom: ".5rem" }} />
        <h1>Cognia Lab</h1>
        <p>{t("practiceToday")}</p>
        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: ".75rem", width: "100%", maxWidth: "280px" }}>
          {features.map(f => (
            <div key={f.label} style={{
              background: "rgba(255,255,255,.15)", borderRadius: "10px",
              padding: ".75rem 1rem", fontSize: ".9rem",
              backdropFilter: "blur(4px)", display: "flex", alignItems: "center", gap: ".6rem"
            }}>
              <Icon id={f.iconId} size={18} /><span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="auth-form-side">
        <div className="auth-box fade-in">
          <h2>{t("welcomeBack")}</h2>
          <p className="subtitle">{t("loginToContinue")}</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">{t("email")}</label>
              <input className="input" type="email" placeholder="tu@correo.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">{t("password")}</label>
              <input className="input" type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required />
              <div style={{ textAlign: "right", marginTop: ".4rem" }}>
                <button type="button" onClick={() => navigate("/forgot-password")}
                  style={{ background: "none", border: "none", color: "var(--primary)", fontSize: ".85rem", cursor: "pointer" }}>
                  {t("forgotPassword")}
                </button>
              </div>
            </div>
            {error && (
              <div style={{ padding: ".75rem 1rem", background: "#FEE2E2", color: "#991B1B",
                            borderRadius: "8px", fontSize: ".9rem", marginBottom: "1rem",
                            display: "flex", alignItems: "center", gap: ".5rem" }}>
                <Icon id="warning" size={16} /><span>{error}</span>
              </div>
            )}
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? t("loggingIn") : t("loginBtn")}
            </button>
          </form>
          <div className="divider">o</div>
          <p style={{ textAlign: "center", fontSize: ".9rem" }}>
            {t("noAccount")}{" "}
            <button onClick={() => navigate("/register")}
              style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}>
              {t("registerFree")}
            </button>
          </p>
          <p style={{ textAlign: "center", fontSize: ".85rem", marginTop: ".75rem" }}>
            <button onClick={() => navigate("/")}
              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: ".85rem" }}>
              {t("backToHome")}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
