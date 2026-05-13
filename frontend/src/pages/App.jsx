import { Routes, Route } from "react-router-dom"
import Landing from "./Landing"
import Login from "./Login"
import Register from "./Register"
import Dashboard from "./Dashboard"
import Topics from "./Topics"
import Questions from "./Questions"

function App() {
  return (
    <Routes>
      <Route path="/"                   element={<Landing />} />
      <Route path="/login"              element={<Login />} />
      <Route path="/register"           element={<Register />} />
      <Route path="/dashboard"          element={<Dashboard />} />
      <Route path="/topics/:subjectId"  element={<Topics />} />
      <Route path="/questions/:topicId" element={<Questions />} />
    </Routes>
  )
}

export default App
