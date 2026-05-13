import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../services/api"

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: "", password: "", name: "", last_name: "",
    country: "Costa Rica", language: "es", theme: "light"
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = await api.post("/register", form)
      if (data.msg) {
        navigate("/login")
      } else {
        setError(data.error || "Error al registrarse")
      }
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
        <div style={{ fontSize: "4rem" }}>🧪</div>
        <h1>Cognia Lab</h1>
        <p>Tu laboratorio de aprendizaje para el bachillerato</p>
        <div style={{ marginTop: "1.5rem", textAlign: "center", opacity: .85 }}>
          <p style={{ color: "#fff", fontSize: ".95rem" }}>
            Únete a estudiantes que ya se preparan con Cognia Lab
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="auth-form-side" style={{ overflowY: "auto" }}>
        <div className="auth-box fade-in">
          <h2>Crear cuenta</h2>
          <p className="subtitle">Empieza a prepararte para el bachillerato</p>

          <form onSubmit={handleRegister}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input className="input" placeholder="Juan" onChange={set("name")} required />
              </div>
              <div className="form-group">
                <label className="form-label">Apellido</label>
                <input className="input" placeholder="Pérez" onChange={set("last_name")} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input className="input" type="email" placeholder="tu@correo.com" onChange={set("email")} required />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input className="input" type="password" placeholder="Mínimo 6 caracteres" onChange={set("password")} required />
            </div>

            <div className="form-group">
              <label className="form-label">País</label>
              <input className="input" placeholder="Costa Rica" value={form.country} onChange={set("country")} />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Idioma</label>
                <select className="input" onChange={set("language")}>
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tema</label>
                <select className="input" onChange={set("theme")}>
                  <option value="light">☀️ Claro</option>
                  <option value="dark">🌙 Oscuro</option>
                </select>
              </div>
            </div>

            {error && (
              <div style={{
                padding: ".75rem 1rem",
                background: "#FEE2E2",
                color: "#991B1B",
                borderRadius: "8px",
                fontSize: ".9rem",
                marginBottom: "1rem"
              }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta gratis"}
            </button>
          </form>

          <div className="divider">o</div>

          <p style={{ textAlign: "center", fontSize: ".9rem" }}>
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={() => navigate("/login")}
              style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}
            >
              Iniciar sesión
            </button>
          </p>
          <p style={{ textAlign: "center", fontSize: ".85rem", marginTop: ".75rem" }}>
            <button
              onClick={() => navigate("/")}
              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: ".85rem" }}
            >
              ← Volver al inicio
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
