import { useNavigate } from "react-router-dom"
import Icon from "../components/Icon"

const features = [
  {
    iconId: "book",
    title: "Contenido oficial",
    desc: "Preguntas basadas en el programa del MEP, organizadas por materia y tema para un estudio estructurado."
  },
  {
    iconId: "chart",
    title: "Progreso en tiempo real",
    desc: "Visualiza tu avance por tema, porcentaje de aciertos y estadísticas detalladas de tu desempeño."
  },
  {
    iconId: "check-circle",
    title: "Feedback inmediato",
    desc: "Cada respuesta incluye una explicación detallada para que entiendas el porqué, no solo el qué."
  },
  {
    iconId: "moon",
    title: "Modo oscuro",
    desc: "Estudia cómodamente de día o de noche con el tema que prefieras, guardado en tu perfil."
  },
  {
    iconId: "target",
    title: "Práctica dirigida",
    desc: "Navega por temas específicos y enfócate en las áreas donde más necesitas mejorar."
  },
  {
    iconId: "robot",
    title: "IA educativa (próximo)",
    desc: "Un tutor inteligente que adaptará el contenido a tu nivel y te guiará en tiempo real."
  },
]

const steps = [
  { n: "1", iconId: "pencil",    title: "Crea tu cuenta",    desc: "Regístrate gratis en menos de un minuto con tu correo." },
  { n: "2", iconId: "open-book", title: "Elige un tema",     desc: "Selecciona la materia y el tema que quieres practicar." },
  { n: "3", iconId: "trophy",    title: "Practica y mejora", desc: "Responde preguntas, recibe feedback y sigue tu progreso." },
]

const subjects = [
  { iconId: "book",       name: "Estudios Sociales", topics: 4, questions: 25, available: true },
  { iconId: "math",       name: "Matemática",        topics: 0, questions: 0,  available: false },
  { iconId: "open-book",  name: "Español",           topics: 0, questions: 0,  available: false },
  { iconId: "microscope", name: "Ciencias",          topics: 0, questions: 0,  available: false },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="page">

      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="landing-nav">
        <span className="landing-nav-brand">
          <Icon id="flask" size={20} style={{ marginRight: ".4rem" }} />
          Cognia Lab
        </span>

        <div className="landing-nav-links">
          <a href="#features">Características</a>
          <a href="#how">Cómo funciona</a>
          <a href="#subjects">Materias</a>
        </div>

        <div style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/login")}>
            Iniciar sesión
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/register")}>
            Empezar gratis
          </button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="hero">
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>

          {/* Texto */}
          <div className="hero-content fade-in">
            <div className="hero-badge">
              <Icon id="flag" size={16} style={{ marginRight: ".4rem" }} />
              Bachillerato Costa Rica
            </div>

            <h1>
              Practica hoy.<br />
              <span className="gradient-text">Domina el examen.</span>
            </h1>

            <p className="hero-sub">
              Cognia Lab es tu laboratorio de aprendizaje para el examen de bachillerato.
              Preguntas reales, feedback inmediato y seguimiento de tu progreso.
            </p>

            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate("/register")}>
                Empezar gratis
                <Icon id="arrow-right" size={18} style={{ marginLeft: ".4rem" }} />
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => navigate("/login")}>
                Ya tengo cuenta
              </button>
            </div>

            <div className="hero-stats">
              <div>
                <span className="hero-stat-num">25+</span>
                <span className="hero-stat-label">Preguntas disponibles</span>
              </div>
              <div>
                <span className="hero-stat-num">4</span>
                <span className="hero-stat-label">Temas de Sociales</span>
              </div>
              <div>
                <span className="hero-stat-num">100%</span>
                <span className="hero-stat-label">Gratuito</span>
              </div>
            </div>
          </div>

          {/* Mockup visual */}
          <div className="fade-in" style={{ animationDelay: ".15s" }}>
            <MockupCard />
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section className="section" id="features">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span className="section-tag">Características</span>
            <h2 className="section-title">Todo lo que necesitas para aprobar</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              Diseñado específicamente para estudiantes costarricenses que se preparan para el bachillerato.
            </p>
          </div>

          <div className="grid-3">
            {features.map((f, i) => (
              <div key={i} className="feature-card fade-in" style={{ animationDelay: `${i * .08}s` }}>
                <div className="feature-icon">
                  <Icon id={f.iconId} size={28} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────── */}
      <section className="section" id="how" style={{ background: "var(--surface2)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span className="section-tag">Proceso</span>
            <h2 className="section-title">Cómo funciona</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              En tres pasos simples empiezas a prepararte para el examen.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((s, i) => (
              <div key={i} className="step-card fade-in" style={{ animationDelay: `${i * .1}s` }}>
                <div className="step-number">{s.n}</div>
                <div style={{ marginBottom: ".75rem" }}>
                  <Icon id={s.iconId} size={32} />
                </div>
                <h3 style={{ marginBottom: ".5rem" }}>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Subjects ───────────────────────────────────────── */}
      <section className="section" id="subjects">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span className="section-tag">Materias</span>
            <h2 className="section-title">Contenido disponible</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              Comenzamos con Estudios Sociales. Más materias se agregarán próximamente.
            </p>
          </div>

          <div className="grid-4">
            {subjects.map((s, i) => (
              <div
                key={i}
                className="card"
                style={{
                  textAlign: "center",
                  opacity: s.available ? 1 : .55,
                  cursor: s.available ? "pointer" : "default",
                  transition: "all .2s"
                }}
                onClick={() => s.available && navigate("/register")}
              >
                <div style={{ marginBottom: ".75rem" }}>
                  <Icon id={s.iconId} size={40} />
                </div>
                <h3 style={{ marginBottom: ".5rem" }}>{s.name}</h3>
                {s.available ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
                    <span className="badge badge-success" style={{ margin: "0 auto" }}>Disponible</span>
                    <p style={{ fontSize: ".85rem", marginTop: ".5rem" }}>
                      {s.topics} temas · {s.questions} preguntas
                    </p>
                  </div>
                ) : (
                  <span className="badge badge-purple" style={{ margin: "0 auto" }}>Próximamente</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <div className="container">
        <div className="cta-section">
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2>¿Listo para dominar el bachillerato?</h2>
            <p>Únete gratis y empieza a practicar hoy mismo.</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn btn-white btn-lg" onClick={() => navigate("/register")}>
                Crear cuenta gratis
                <Icon id="arrow-right" size={18} style={{ marginLeft: ".4rem" }} />
              </button>
              <button
                className="btn btn-lg"
                style={{ background: "rgba(255,255,255,.15)", color: "#fff", border: "2px solid rgba(255,255,255,.4)" }}
                onClick={() => navigate("/login")}
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="footer">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "3rem", paddingBottom: "2rem", borderBottom: "1px solid #1F2937" }}>
            <div>
              <div className="footer-brand">
                <Icon id="flask" size={18} style={{ marginRight: ".4rem" }} />
                Cognia Lab
              </div>
              <p style={{ fontSize: ".9rem", maxWidth: "280px", marginTop: ".5rem" }}>
                Laboratorio de aprendizaje para la preparación del examen de bachillerato de Costa Rica.
              </p>
            </div>
            <div>
              <h3 style={{ color: "#E5E7EB", marginBottom: "1rem", fontSize: ".95rem" }}>Plataforma</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
                {["Materias", "Progreso", "Simulacros"].map(l => (
                  <span key={l} style={{ fontSize: ".9rem", cursor: "pointer" }}
                    onClick={() => navigate("/register")}>{l}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ color: "#E5E7EB", marginBottom: "1rem", fontSize: ".95rem" }}>Cuenta</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
                {[["Registrarse", "/register"], ["Iniciar sesión", "/login"]].map(([l, r]) => (
                  <span key={l} style={{ fontSize: ".9rem", cursor: "pointer" }}
                    onClick={() => navigate(r)}>{l}</span>
                ))}
              </div>
            </div>
          </div>
          <p className="footer-copy">
            © 2025 Cognia Lab · Hecho para estudiantes costarricenses
          </p>
        </div>
      </footer>

    </div>
  )
}

/* ── Mockup visual ─────────────────────────────────────────── */
function MockupCard() {
  return (
    <div style={{ position: "relative" }}>
      {/* Tarjeta principal */}
      <div className="card float" style={{
        background: "var(--surface)",
        borderRadius: "20px",
        padding: "1.75rem",
        boxShadow: "var(--shadow-lg)",
        border: "1px solid var(--border)"
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.25rem" }}>
          <div style={{
            width: 40, height: 40, borderRadius: "10px",
            background: "var(--gradient-card)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff"
          }}>
            <Icon id="book" size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: ".95rem", color: "var(--text)" }}>Historia de Costa Rica</div>
            <div style={{ fontSize: ".8rem", color: "var(--text-muted)" }}>Pregunta 3 de 8</div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="progress-track" style={{ marginBottom: "1.25rem" }}>
          <div className="progress-fill" style={{ width: "37.5%" }} />
        </div>

        {/* Pregunta */}
        <p style={{ fontWeight: 600, color: "var(--text)", fontSize: ".95rem", marginBottom: "1rem" }}>
          ¿En qué año se abolió el ejército en Costa Rica?
        </p>

        {/* Opciones */}
        {[
          { l: "A", t: "1948", s: "" },
          { l: "B", t: "1949", s: "correct" },
          { l: "C", t: "1950", s: "" },
          { l: "D", t: "1821", s: "" },
        ].map(o => (
          <div key={o.l} className={`option-btn ${o.s}`}
            style={{ marginBottom: ".5rem", pointerEvents: "none", padding: ".65rem 1rem" }}>
            <span className="option-letter" style={{ width: 28, height: 28, fontSize: ".8rem" }}>{o.l}</span>
            <span style={{ fontSize: ".9rem" }}>{o.t}</span>
            {o.s === "correct" && (
              <span style={{ marginLeft: "auto", color: "var(--success)" }}>
                <Icon id="check-circle" size={16} />
              </span>
            )}
          </div>
        ))}

        {/* Explicación */}
        <div className="explanation-box" style={{ fontSize: ".82rem", marginTop: ".75rem", display: "flex", gap: ".5rem", alignItems: "flex-start" }}>
          <Icon id="lightbulb" size={14} style={{ marginTop: "2px", flexShrink: 0 }} />
          José Figueres Ferrer abolió el ejército el 1 de diciembre de 1948.
        </div>
      </div>

      {/* Badge flotante — stats */}
      <div style={{
        position: "absolute", top: "-20px", right: "-20px",
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "14px", padding: ".75rem 1rem",
        boxShadow: "var(--shadow-md)",
        display: "flex", alignItems: "center", gap: ".6rem"
      }}>
        <Icon id="trophy" size={22} style={{ color: "var(--primary)" }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: ".9rem", color: "var(--text)" }}>85%</div>
          <div style={{ fontSize: ".75rem", color: "var(--text-muted)" }}>Precisión</div>
        </div>
      </div>

      {/* Badge flotante — racha */}
      <div style={{
        position: "absolute", bottom: "-16px", left: "-16px",
        background: "var(--gradient-card)", color: "#fff",
        borderRadius: "12px", padding: ".6rem 1rem",
        boxShadow: "var(--shadow-md)",
        fontSize: ".85rem", fontWeight: 700,
        display: "flex", alignItems: "center", gap: ".4rem"
      }}>
        <Icon id="fire" size={16} />
        3 correctas seguidas
      </div>
    </div>
  )
}
