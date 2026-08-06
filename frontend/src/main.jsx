import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./pages/App.jsx"
import { LangProvider } from "./i18n.jsx"
import "./index.css"

const user = JSON.parse(localStorage.getItem("user")) || {}
document.documentElement.setAttribute("data-theme", user.theme || "light")

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null } }
  static getDerivedStateFromError(error) { return { hasError: true, error } }
  componentDidCatch(error, info) {
    console.error("App error:", error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", textAlign: "center", fontFamily: "sans-serif" }}>
          <h2>Algo salió mal 😕</h2>
          <p style={{ color: "#666", marginBottom: "1rem" }}>{this.state.error?.message}</p>
          <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = "/login" }}
            style={{ padding: ".75rem 1.5rem", background: "#4F46E5", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>
            Volver al inicio
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <BrowserRouter>
      <LangProvider>
        <App />
      </LangProvider>
    </BrowserRouter>
  </ErrorBoundary>
)
