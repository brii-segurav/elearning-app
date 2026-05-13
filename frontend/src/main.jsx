import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./pages/App.jsx"
import "./index.css"

// Aplicar tema guardado antes de renderizar
const user = JSON.parse(localStorage.getItem("user")) || {}
document.documentElement.setAttribute("data-theme", user.theme || "light")

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
