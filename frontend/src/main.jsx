import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./pages/App.jsx"
import "./index.css"

// Aplicar tema guardado antes de renderizar
const user = JSON.parse(localStorage.getItem("user")) || {}
document.documentElement.setAttribute("data-theme", user.theme || "light")

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: false } // no mostrar pantalla de error, intentar recuperarse
  }
  componentDidCatch(error) {
    // Ignorar errores de DOM causados por extensiones del navegador (Grammarly, traductores)
    if (error?.message?.includes("removeChild") || error?.message?.includes("NotFoundError")) {
      this.setState({ hasError: false })
    }
  }
  render() {
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ErrorBoundary>
)
