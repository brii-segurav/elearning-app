import { Routes, Route, useLocation } from "react-router-dom"
import Landing from "./Landing"
import Login from "./Login"
import Register from "./Register"
import Dashboard from "./Dashboard"
import Topics from "./Topics"
import Questions from "./Questions"
import ForgotPassword from "./ForgotPassword"
import Simulacro from "./Simulacro"
import Flashcards from "./Flashcards"
import Cogi from "../components/Cogi"

// Páginas donde NO mostramos a Cogi (auth y landing)
const NO_COGI = ["/", "/login", "/register", "/forgot-password"]

function App() {
  const { pathname } = useLocation()
  const showCogi = !NO_COGI.includes(pathname)

  return (
    <>
      <Routes>
        <Route path="/"                    element={<Landing />} />
        <Route path="/login"               element={<Login />} />
        <Route path="/register"            element={<Register />} />
        <Route path="/forgot-password"     element={<ForgotPassword />} />
        <Route path="/dashboard"           element={<Dashboard />} />
        <Route path="/topics/:subjectId"   element={<Topics />} />
        <Route path="/flashcards/:topicId" element={<Flashcards />} />
        <Route path="/questions/:topicId"  element={<Questions />} />
        <Route path="/simulacro"           element={<Simulacro />} />
      </Routes>
      {showCogi && <Cogi />}
    </>
  )
}

export default App
