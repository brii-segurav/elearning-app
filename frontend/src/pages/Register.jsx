import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../services/api"
import Icon from "../components/Icon"
import { useT } from "../i18n.jsx"

function Register() {
  const navigate = useNavigate()
  const t        = useT()
  const [form, setForm] = useState({
    email: "", password: "", name: "", last_name: "",
    country: "Costa Rica", language: "es", theme: "light"
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleRegister = async (e) => {
    e.preventDefault(); setError(""); setLoading(true)
    try {
      const data = await api.post("/register", form)
      if (data.msg) navigate("/login")
      else setError(data.error || "Error al registrarse")
    } catch { setError("No se pudo conectar con el servidor") }
    finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <Icon id="flask" size={64} style={{ color: "#fff", marginBottom: ".5rem" }} />
        <h1>Cognia Lab</h1>
        <p>{t("startPreparing")}</p>
      </div>
      <div className="auth-form-side" style={{ overflowY: "auto" }}>
        <div className="auth-box fade-in">
          <h2>{t("createAccount")}</h2>
          <p className="subtitle">{t("startPreparing")}</p>
          <form onSubmit={handleRegister}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">{t("name")}</label>
                <input className="input" placeholder="Juan" onChange={set("name")} required />
              </div>
              <div className="form-group">
                <label className="form-label">{t("lastName")}</label>
                <input className="input" placeholder="Pérez" onChange={set("last_name")} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t("email")}</label>
              <input className="input" type="email" placeholder="tu@correo.com" onChange={set("email")} required />
            </div>
            <div className="form-group">
              <label className="form-label">{t("password")}</label>
              <input className="input" type="password" placeholder="Mínimo 6 caracteres" onChange={set("password")} required />
            </div>
            <div className="form-group">
              <label className="form-label">{t("country")}</label>
              <input className="input" placeholder="Costa Rica" value={form.country} onChange={set("country")} />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">{t("language")}</label>
                <select className="input" onChange={set("language")}>
                  <option value="es">{t("spanish")}</option>
                  <option value="en">{t("english")}</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t("theme")}</label>
                <select className="input" onChange={set("theme")}>
                  <option value="light">{t("lightTheme")}</option>
                  <option value="dark">{t("darkTheme")}</option>
                </select>
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
              {loading ? t("creating") : t("createBtn")}
            </button>
          </form>
          <div className="divider">o</div>
          <p style={{ textAlign: "center", fontSize: ".9rem" }}>
            {t("alreadyAccount")}{" "}
            <button onClick={() => navigate("/login")}
              style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}>
              {t("loginLink")}
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

export default Register
