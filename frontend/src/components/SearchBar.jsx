import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../services/api"
import Icon from "./Icon"
import { useT } from "../i18n.jsx"

const DIFF_COLORS = {
  easy:   { bg: "#D1FAE5", color: "#065F46" },
  medium: { bg: "#FEF3C7", color: "#92400E" },
  hard:   { bg: "#FEE2E2", color: "#991B1B" },
}

export default function SearchBar({ onNavigate }) {
  const navigate   = useNavigate()
  const t          = useT()
  const [query, setQuery]       = useState("")
  const [results, setResults]   = useState([])
  const [loading, setLoading]   = useState(false)
  const [open, setOpen]         = useState(false)
  const [focused, setFocused]   = useState(-1)
  const inputRef  = useRef(null)
  const wrapRef   = useRef(null)
  const timerRef  = useRef(null)

  // Debounce — busca 300ms después de dejar de escribir
  useEffect(() => {
    if (!query.trim() || query.trim().length < 1) {
      setResults([]); setOpen(false); return
    }
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await api.get(`/search?q=${encodeURIComponent(query.trim())}`)
        setResults(data.results || [])
        setOpen(true)
        setFocused(-1)
      } catch { setResults([]) }
      finally { setLoading(false) }
    }, 200)
    return () => clearTimeout(timerRef.current)
  }, [query])

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleKey = (e) => {
    if (!open || results.length === 0) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setFocused(f => Math.min(f + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setFocused(f => Math.max(f - 1, 0))
    } else if (e.key === "Enter" && focused >= 0) {
      e.preventDefault()
      handleSelect(results[focused])
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  const handleSelect = (result) => {
    setQuery("")
    setOpen(false)
    navigate(result.navigate_to)
    onNavigate?.()
  }

  const typeLabel = (type) => {
    if (type === "subject")  return { label: t("subjects"), cls: "badge-primary" }
    if (type === "topic")    return { label: t("topics"),   cls: "badge-success" }
    if (type === "question") return { label: t("question"), cls: "badge-warning" }
    return { label: type, cls: "badge-primary" }
  }

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%", maxWidth: "520px" }}>
      {/* Input */}
      <div style={{
        display: "flex", alignItems: "center", gap: ".6rem",
        background: "var(--surface2)", border: "2px solid var(--border)",
        borderRadius: "999px", padding: ".5rem 1rem",
        transition: "border-color .2s, box-shadow .2s",
        ...(open || query ? { borderColor: "var(--primary)", boxShadow: "0 0 0 3px rgba(79,70,229,.12)" } : {})
      }}>
        <Icon id={loading ? "spinner" : "search"} size={18}
          style={{ color: "var(--text-muted)", flexShrink: 0,
                   animation: loading ? "spin 1s linear infinite" : "none" }} />
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={handleKey}
          placeholder={`${t("subjects")}, ${t("topics")}, ${t("question").toLowerCase()}...`}
          style={{
            border: "none", background: "transparent", outline: "none",
            width: "100%", fontSize: ".95rem", color: "var(--text)"
          }}
        />
        {query && (
          <button onClick={() => { setQuery(""); setOpen(false); inputRef.current?.focus() }}
            style={{ background: "none", border: "none", cursor: "pointer",
                     color: "var(--text-muted)", padding: 0, display: "flex" }}>
            <Icon id="x-mark" size={16} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,.15)",
          zIndex: 200, overflow: "hidden", maxHeight: "420px", overflowY: "auto"
        }}>
          {/* Agrupar por tipo */}
          {["subject", "topic", "question"].map(type => {
            const group = results.filter(r => r.type === type)
            if (group.length === 0) return null
            const { label } = typeLabel(type)
            return (
              <div key={type}>
                <div style={{
                  padding: ".5rem 1rem .3rem", fontSize: ".75rem", fontWeight: 700,
                  color: "var(--text-muted)", textTransform: "uppercase",
                  letterSpacing: ".06em", borderTop: type !== "subject" ? "1px solid var(--border)" : "none"
                }}>
                  {label}
                </div>
                {group.map((r, i) => {
                  const globalIdx = results.indexOf(r)
                  const isFocused = focused === globalIdx
                  const diff      = r.difficulty ? DIFF_COLORS[r.difficulty] : null
                  return (
                    <div key={r.id + r.type}
                      onMouseEnter={() => setFocused(globalIdx)}
                      onClick={() => handleSelect(r)}
                      style={{
                        padding: ".75rem 1rem", cursor: "pointer",
                        background: isFocused ? "var(--primary-light)" : "transparent",
                        display: "flex", alignItems: "flex-start", gap: ".75rem",
                        transition: "background .15s"
                      }}
                    >
                      {/* Icono */}
                      <div style={{
                        width: 32, height: 32, borderRadius: "8px", flexShrink: 0,
                        background: isFocused ? "var(--primary)" : "var(--surface2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "background .15s"
                      }}>
                        <Icon id={r.icon} size={16}
                          style={{ color: isFocused ? "#fff" : "var(--primary)" }} />
                      </div>
                      {/* Texto */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: ".9rem", color: "var(--text)",
                                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {highlightMatch(r.title, query)}
                        </div>
                        {r.subtitle && (
                          <div style={{ fontSize: ".8rem", color: "var(--text-muted)", marginTop: ".1rem" }}>
                            {r.subtitle}
                          </div>
                        )}
                      </div>
                      {/* Badge dificultad */}
                      {diff && (
                        <span style={{
                          fontSize: ".72rem", fontWeight: 700, padding: ".2rem .5rem",
                          borderRadius: "999px", flexShrink: 0,
                          background: diff.bg, color: diff.color
                        }}>
                          {t(r.difficulty)}
                        </span>
                      )}
                      {/* Flecha */}
                      <Icon id="arrow-right" size={14} style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: "2px" }} />
                    </div>
                  )
                })}
              </div>
            )
          })}

          {/* Footer */}
          <div style={{
            padding: ".6rem 1rem", borderTop: "1px solid var(--border)",
            fontSize: ".78rem", color: "var(--text-muted)",
            display: "flex", alignItems: "center", gap: ".4rem"
          }}>
            <Icon id="search" size={12} />
            <span>{results.length} resultado{results.length !== 1 ? "s" : ""} para «{query}»</span>
          </div>
        </div>
      )}

      {/* Sin resultados */}
      {open && results.length === 0 && !loading && query.length >= 1 && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "16px", padding: "1.25rem", textAlign: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,.12)", zIndex: 200
        }}>
          <Icon id="search" size={28} style={{ color: "var(--text-muted)", marginBottom: ".5rem" }} />
          <p style={{ fontSize: ".9rem", margin: 0 }}>
            No se encontraron resultados para <strong>«{query}»</strong>
          </p>
        </div>
      )}
    </div>
  )
}

// Resalta la parte del texto que coincide con la búsqueda
function highlightMatch(text, query) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: "rgba(79,70,229,.18)", color: "var(--primary)",
                     borderRadius: "3px", padding: "0 1px" }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}
