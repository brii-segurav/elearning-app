export const getUser = () => {
  return JSON.parse(localStorage.getItem("user")) || {}
}

export const getTheme = () => {
  const user = getUser()
  return user.theme || "light"
}

export const getText = () => {
  const user = getUser()
  const lang = user.language || "es"

  return {
    welcome: lang === "en" ? "Hello" : "Hola",
    login: lang === "en" ? "Login" : "Iniciar sesión",
    register: lang === "en" ? "Register" : "Registrarse",
    email: lang === "en" ? "Email" : "Correo",
    password: lang === "en" ? "Password" : "Contraseña",
    subjects: lang === "en" ? "Subjects" : "Materias",
    logout: lang === "en" ? "Logout" : "Cerrar sesión"
  }
}