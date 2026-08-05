import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../services/api"
import Icon from "../components/Icon"

function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep]       = useState("email")   // "email" | "code" | "done"
  const [email, setEmail]     = useState("")
  const [code, setCode]       = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm]   = useState("")
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")
  const [msg, setMsg]           = useState("")

  // Paso 1 — enviar correo
  const handleSendCode = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const data = await api.post("/forgot-password", { email })
      if (data.error) { setError(data.error); return }
      setMsg("Revisa tu correo. El código expira en 15 minutos.")
      setStep("code")
    } catch {
      setError("No se pudo conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  // Paso 2 — verificar código y nueva contraseña
  const handleReset = async (e) => {
    e.preventDefault()
    setError("")
    if (password !== confirm) { setError("Las contraseñas no coinciden"); return }
    if (password.length < 6)  { setError("La contraseña debe tener al menos 6 caracteres"); return }
    setLoading(true)
    try {
      const data = await api.post("/reset-password", { email, code, password })
      if (data.error) { setError(data.error); return }
      setStep("done")
    } catch {
      setError("No se pudo conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Hero */}
      <div className="auth-hero">
        <Icon id="flask" size={64} style={{ color: "#fff", marginBottom: ".5rem" }} />
        <h1>Cognia Lab</h1>
        <p>Recupera el acceso a tu cuenta</p>
      </div>

      {/* Form */}
      <div className="auth-form-side">
        <div className="auth-box fade-in">

          {/* ── Paso 1: ingresar correo ── */}
          {step === "email" && (
            <>
              <h2>¿Olvidaste tu contraseña?</h2>
              <p className="subtitle">Ingresa tu correo y te enviaremos un código de verificación</p>
              <form onSubmit={handleSendCode}>
                <div className="form-group">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div style={{
                    padding: ".75rem 1rem", background: "#FEE2E2", color: "#991B1B",
                    borderRadius: "8px", fontSize: ".9rem", marginBottom: "1rem",
                    display: "flex", alignItems: "center", gap: ".5rem"
                  }}>
                    <Icon id="warning" size={16} /><span>{error}</span>
                  </div>
                )}

                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar código"}
                </button>
              </form>
            </>
          )}

          {/* ── Paso 2: ingresar código + nueva contraseña ── */}
          {step === "code" && (
            <>
              <h2>Ingresa el código</h2>
              {msg && (
                <div style={{
                  padding: ".75rem 1rem", background: "#D1FAE5", color: "#065F46",
                  borderRadius: "8px", fontSize: ".9rem", marginBottom: "1.25rem",
                  display: "flex", alignItems: "center", gap: ".5rem"
                }}>
                  <Icon id="check-circle" size={16} /><span>{msg}</span>
                </div>
              )}
              <form onSubmit={handleReset}>
                <div className="form-group">
                  <label className="form-label">Código de 6 dígitos</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
                    required
                    style={{ letterSpacing: ".4rem", fontSize: "1.2rem", textAlign: "center" }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nueva contraseña</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirmar contraseña</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="Repite la contraseña"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div style={{
                    padding: ".75rem 1rem", background: "#FEE2E2", color: "#991B1B",
                    borderRadius: "8px", fontSize: ".9rem", marginBottom: "1rem",
                    display: "flex", alignItems: "center", gap: ".5rem"
                  }}>
                    <Icon id="warning" size={16} /><span>{error}</span>
                  </div>
                )}

                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? "Guardando..." : "Cambiar contraseña"}
                </button>
              </form>
              <p style={{ textAlign: "center", fontSize: ".85rem", marginTop: "1rem" }}>
                <button
                  onClick={() => { setStep("email"); setError(""); setMsg("") }}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  ← Usar otro correo
                </button>
              </p>
            </>
          )}

          {/* ── Paso 3: éxito ── */}
          {step === "done" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "var(--success)", marginBottom: "1rem" }}>
                <Icon id="check-circle" size={56} />
              </div>
              <h2>¡Contraseña actualizada!</h2>
              <p style={{ marginBottom: "1.5rem" }}>Ya puedes iniciar sesión con tu nueva contraseña.</p>
              <button className="btn btn-primary btn-full" onClick={() => navigate("/login")}>
                Ir al inicio de sesión
              </button>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              onClick={() => navigate("/login")}
              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: ".85rem" }}
            >
              ← Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
