import { useState, useRef, useEffect } from "react"
import { api } from "../services/api"
import { useT, useLang } from "../i18n.jsx"

// ── Corgi SVG animado ─────────────────────────────────────────────────────────
function CorgiAvatar({ size = 48, animated = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", ...(animated ? { animation: "cogi-bounce .6s ease infinite alternate" } : {}) }}>
      {/* Cuerpo */}
      <ellipse cx="50" cy="68" rx="28" ry="18" fill="#F4A535"/>
      {/* Cabeza */}
      <ellipse cx="50" cy="42" rx="26" ry="24" fill="#F4A535"/>
      {/* Cara blanca */}
      <ellipse cx="50" cy="48" rx="16" ry="14" fill="#FDE8B0"/>
      {/* Oreja izquierda */}
      <ellipse cx="26" cy="28" rx="10" ry="14" fill="#C97B1A" transform="rotate(-20 26 28)"/>
      <ellipse cx="26" cy="28" rx="6"  ry="10" fill="#8B4513" transform="rotate(-20 26 28)"/>
      {/* Oreja derecha */}
      <ellipse cx="74" cy="28" rx="10" ry="14" fill="#C97B1A" transform="rotate(20 74 28)"/>
      <ellipse cx="74" cy="28" rx="6"  ry="10" fill="#8B4513" transform="rotate(20 74 28)"/>
      {/* Ojos */}
      <circle cx="42" cy="42" r="5" fill="#2D1A0E"/>
      <circle cx="58" cy="42" r="5" fill="#2D1A0E"/>
      <circle cx="43.5" cy="40.5" r="1.5" fill="#fff"/>
      <circle cx="59.5" cy="40.5" r="1.5" fill="#fff"/>
      {/* Nariz */}
      <ellipse cx="50" cy="52" rx="5" ry="3.5" fill="#2D1A0E"/>
      {/* Boca sonriente */}
      <path d="M44 57 Q50 63 56 57" fill="none" stroke="#2D1A0E" strokeWidth="2" strokeLinecap="round"/>
      {/* Mejillas */}
      <circle cx="36" cy="54" r="5" fill="#F08080" opacity="0.5"/>
      <circle cx="64" cy="54" r="5" fill="#F08080" opacity="0.5"/>
      {/* Patitas */}
      <ellipse cx="34" cy="84" rx="8" ry="6"  fill="#F4A535"/>
      <ellipse cx="66" cy="84" rx="8" ry="6"  fill="#F4A535"/>
      <ellipse cx="34" cy="87" rx="7" ry="4"  fill="#FDE8B0"/>
      <ellipse cx="66" cy="87" rx="7" ry="4"  fill="#FDE8B0"/>
      {/* Cola */}
      <ellipse cx="78" cy="60" rx="7" ry="5" fill="#F4A535" transform="rotate(-30 78 60)"/>
    </svg>
  )
}

// ── Burbuja de mensaje ────────────────────────────────────────────────────────
function Bubble({ msg }) {
  const isUser = msg.role === "user"
  return (
    <div style={{
      display: "flex", gap: ".5rem", justifyContent: isUser ? "flex-end" : "flex-start",
      alignItems: "flex-end", marginBottom: ".75rem"
    }}>
      {!isUser && (
        <div style={{ flexShrink: 0, marginBottom: "2px" }}>
          <CorgiAvatar size={28} />
        </div>
      )}
      <div style={{
        maxWidth: "80%", padding: ".6rem .9rem", borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        background: isUser ? "var(--primary)" : "var(--surface2)",
        color: isUser ? "#fff" : "var(--text)",
        fontSize: ".88rem", lineHeight: "1.55",
        boxShadow: "0 1px 4px rgba(0,0,0,.08)",
        whiteSpace: "pre-wrap", wordBreak: "break-word"
      }}>
        {msg.content}
      </div>
    </div>
  )
}

// ── Indicador de "está escribiendo" ──────────────────────────────────────────
function Typing() {
  return (
    <div style={{ display: "flex", gap: ".5rem", alignItems: "flex-end", marginBottom: ".75rem" }}>
      <CorgiAvatar size={28} />
      <div style={{
        padding: ".6rem .9rem", borderRadius: "18px 18px 18px 4px",
        background: "var(--surface2)", display: "flex", gap: "4px", alignItems: "center"
      }}>
        {[0,1,2].map(i => (
          <span key={i} style={{
            width: 7, height: 7, borderRadius: "50%", background: "var(--text-muted)",
            display: "inline-block",
            animation: `typing-dot .9s ease-in-out ${i * .2}s infinite`
          }} />
        ))}
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Cogi() {
  const t    = useT()
  const lang = useLang()

  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState("")
  const [loading, setLoading]   = useState(false)
  const [wiggle, setWiggle]     = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  // Saludo inicial cuando se abre por primera vez
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: t("cogiGreeting") }])
    }
  }, [open])

  // Scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  // Wiggle del botón cada 8 segundos para llamar la atención
  useEffect(() => {
    if (open) return
    const id = setInterval(() => {
      setWiggle(true)
      setTimeout(() => setWiggle(false), 600)
    }, 8000)
    return () => clearInterval(id)
  }, [open])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: "user", content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    try {
      const data = await api.post("/cogi", {
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        lang
      })
      if (data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }])
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: t("cogiError") }])
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: t("cogiError") }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleClear = () => {
    setMessages([{ role: "assistant", content: t("cogiGreeting") }])
  }

  return (
    <>
      {/* ── CSS animaciones ── */}
      <style>{`
        @keyframes cogi-bounce { from { transform: translateY(0); } to { transform: translateY(-4px); } }
        @keyframes typing-dot  { 0%,80%,100% { transform: scale(1); opacity:.4; } 40% { transform: scale(1.3); opacity:1; } }
        @keyframes cogi-pop    { 0% { transform: scale(.4); opacity:0; } 80% { transform: scale(1.05); } 100% { transform: scale(1); opacity:1; } }
        @keyframes cogi-wiggle { 0%,100% { transform: rotate(0); } 25% { transform: rotate(-12deg); } 75% { transform: rotate(12deg); } }
        .cogi-fab:hover .cogi-avatar { animation: cogi-bounce .4s ease infinite alternate !important; }
      `}</style>

      {/* ── Chat window ── */}
      {open && (
        <div style={{
          position: "fixed", bottom: "90px", right: "24px", zIndex: 1000,
          width: "360px", maxWidth: "calc(100vw - 32px)",
          background: "var(--surface)", borderRadius: "20px",
          boxShadow: "0 8px 40px rgba(0,0,0,.2)", border: "1px solid var(--border)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          animation: "cogi-pop .25s ease"
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #F4A535 0%, #e8830a 100%)",
            padding: ".85rem 1rem", display: "flex", alignItems: "center", gap: ".75rem"
          }}>
            <CorgiAvatar size={40} animated />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, color: "#fff", fontSize: "1rem" }}>{t("cogiName")}</div>
              <div style={{ fontSize: ".78rem", color: "rgba(255,255,255,.85)" }}>{t("cogiSubtitle")}</div>
            </div>
            <button onClick={handleClear} title={t("cogiClear")}
              style={{ background: "rgba(255,255,255,.2)", border: "none", borderRadius: "8px",
                       padding: ".3rem .5rem", cursor: "pointer", color: "#fff", fontSize: ".75rem" }}>
              ↺
            </button>
            <button onClick={() => setOpen(false)} title={t("cogiClose")}
              style={{ background: "rgba(255,255,255,.2)", border: "none", borderRadius: "8px",
                       padding: ".3rem .5rem", cursor: "pointer", color: "#fff", fontWeight: 700 }}>
              ✕
            </button>
          </div>

          {/* Mensajes */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "1rem",
            minHeight: "260px", maxHeight: "380px",
            scrollbarWidth: "thin"
          }}>
            {messages.map((m, i) => <Bubble key={i} msg={m} />)}
            {loading && <Typing />}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: ".75rem", borderTop: "1px solid var(--border)",
            display: "flex", gap: ".5rem", alignItems: "flex-end"
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={t("cogiPlaceholder")}
              rows={1}
              style={{
                flex: 1, resize: "none", border: "2px solid var(--border)",
                borderRadius: "12px", padding: ".55rem .75rem",
                background: "var(--surface2)", color: "var(--text)",
                fontSize: ".88rem", outline: "none", lineHeight: "1.4",
                transition: "border-color .2s",
                maxHeight: "100px", overflowY: "auto",
                fontFamily: "inherit"
              }}
              onFocus={e => e.target.style.borderColor = "#F4A535"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
            <button onClick={handleSend} disabled={!input.trim() || loading}
              style={{
                width: 38, height: 38, borderRadius: "50%", border: "none",
                background: input.trim() && !loading ? "linear-gradient(135deg, #F4A535, #e8830a)" : "var(--surface2)",
                color: input.trim() && !loading ? "#fff" : "var(--text-muted)",
                cursor: input.trim() && !loading ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all .2s",
                fontSize: "1.1rem"
              }}>
              ➤
            </button>
          </div>
        </div>
      )}

      {/* ── FAB (botón flotante) ── */}
      <button
        className="cogi-fab"
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: "24px", right: "24px", zIndex: 1001,
          width: 60, height: 60, borderRadius: "50%", border: "none",
          background: "linear-gradient(135deg, #F4A535 0%, #e8830a 100%)",
          boxShadow: "0 4px 20px rgba(244,165,53,.5)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform .2s, box-shadow .2s",
          animation: wiggle ? "cogi-wiggle .4s ease" : "none"
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        title={t("cogiName")}
      >
        <div className="cogi-avatar" style={{ pointerEvents: "none" }}>
          {open
            ? <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.3rem" }}>✕</span>
            : <CorgiAvatar size={40} />
          }
        </div>
      </button>
    </>
  )
}
