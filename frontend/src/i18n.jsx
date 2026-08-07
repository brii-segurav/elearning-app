/**
 * Sistema de internacionalización con React Context.
 * - Envuelve la app en <LangProvider>
 * - Usa useT() en cualquier componente para obtener la función t()
 * - Al cambiar idioma en Mi Cuenta y guardar, toda la app se actualiza
 */
import { createContext, useContext, useState, useEffect } from "react"

// ── Diccionario ───────────────────────────────────────────────────────────────
const dict = {
  es: {
    // Navbar / general
    appName: "Cognia Lab",
    subjects: "Materias", progress: "Progreso", news: "Noticias",
    myAccount: "Mi cuenta", logout: "Salir", dashboard: "Dashboard",
    loading: "Cargando...", exit: "Salir", cancel: "Cancelar",
    back: "← Volver", save: "Guardar", saving: "Guardando...",

    // Dashboard
    hello: "Hola", practiceToday: "Practica hoy. Domina el examen.",
    availableSubjects: "Materias disponibles",
    subject: "materia", subjectsPlural: "materias",
    yourProgress: "Tu progreso", average: "Promedio",
    noProgress: "Sin progreso aún",
    noProgressDesc: "Responde preguntas para ver tu avance aquí",
    newsTitle: "Noticias y actualizaciones",
    questionsAnswered: "Preguntas respondidas",
    correctAnswers: "Respuestas correctas",
    accuracy: "Precisión", topicsStudied: "Temas estudiados",
    simulacroMEP: "Simulacro MEP",
    simulacroDesc: "50 preguntas · 90 minutos · Formato oficial del bachillerato",
    seeTopics: "Ver temas", generalProgress: "Progreso general",
    correct: "Correctas", incorrect: "Incorrectas",

    // Topics
    topics: "Temas", mastered: "Dominado",
    inProgress: "En progreso", notStarted: "Sin iniciar",
    progressLabel: "Progreso", flashcards: "Flashcards",
    continuePractice: "Continuar práctica", quiz3min: "Quiz 3 min",
    backToSubjects: "← Volver a materias",
    backToTopics: "← Volver a temas",

    // Questions / Quiz
    question: "Pregunta", of: "de",
    easy: "Fácil", medium: "Medio", hard: "Difícil",
    explanation: "Explicación", next: "Siguiente",
    seeResults: "Ver resultados", verifying: "Verificando...",
    readText: "Lea el siguiente texto y responda:",
    practiceCompleted: "Práctica completada",
    quizCompleted: "Quiz completado",
    repeat: "Repetir",
    timeUp: "¡Se acabó el tiempo!", score: "Puntuación",
    loadingQuestions: "Cargando preguntas...",
    noQuestions: "Sin preguntas disponibles",
    noQuestionsDesc: "Este tema aún no tiene preguntas cargadas",
    excellentMsg: "¡Excelente dominio del tema!",
    goodMsg: "Buen trabajo, sigue practicando",
    keepGoingMsg: "Sigue practicando, vas a mejorar",

    // Flashcards
    loadingFlashcards: "Cargando flashcards...",
    deckCompleted: "Mazo completado", reviewCompleted: "Repaso completado",
    dominated: "Dominadas", toReview: "Por repasar",
    restartDeck: "Reiniciar mazo completo",
    reviewWeak: "Repasar las difíciles",
    tapToReveal: "Toca para revelar la respuesta",
    answer: "Respuesta", iKnow: "Lo sé", iDontKnow: "No lo sé",
    textReference: "Texto de referencia",
    tapCard: "Toca la tarjeta para ver la respuesta",
    reviewMode: "(repaso)", dominatedAll: "¡Dominaste todas las tarjetas!",
    dominated_of: "Dominaste", cards_of: "de", cardsLabel: "tarjetas",

    // Simulacro
    simulacroTitle: "Simulacro MEP",
    officialFormat: "Examen de bachillerato en el formato oficial del MEP",
    questions50: "50 preguntas de selección única",
    time90: "90 minutos de tiempo máximo",
    blockedOnTime: "Al terminar el tiempo se bloquea automáticamente",
    gradeScale: "Nota en escala 0-100 (aprobado: 70)",
    detailedReview: "Revisión detallada de respuestas al finalizar",
    startSimulacro: "Comenzar simulacro",
    answered: "respondidas", finish: "Terminar",
    navigation: "Navegación", previous: "← Anterior",
    finishExam: "Finalizar examen",
    simulacroCompleted: "Simulacro completado",
    passed: "¡Aprobado! Buen dominio del contenido.",
    failed: "No aprobado. Sigue practicando para mejorar.",
    minToPass: "Nota / 100 — Mínimo para aprobar:",
    timeUsed: "Tiempo utilizado:", timeOf: "de",
    newSimulacro: "Nuevo simulacro", toDashboard: "Ir al Dashboard",
    reviewAnswers: "Revisión de respuestas",
    seeContext: "Ver texto de contexto", unanswered: "Sin responder",
    timeExpired: "Tiempo agotado — examen bloqueado automáticamente",

    // Auth
    welcomeBack: "Bienvenido de vuelta",
    loginToContinue: "Inicia sesión para continuar estudiando",
    email: "Correo electrónico", password: "Contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    loginBtn: "Iniciar sesión", loggingIn: "Iniciando sesión...",
    noAccount: "¿No tienes cuenta?", registerFree: "Regístrate gratis",
    backToHome: "← Volver al inicio",
    createAccount: "Crear cuenta",
    startPreparing: "Empieza a prepararte para el bachillerato",
    name: "Nombre", lastName: "Apellido", country: "País",
    language: "Idioma", theme: "Tema",
    createBtn: "Crear cuenta gratis", creating: "Creando cuenta...",
    alreadyAccount: "¿Ya tienes cuenta?", loginLink: "Iniciar sesión",

    // Account
    myAccountTitle: "Mi cuenta", saveChanges: "Guardar cambios",
    savedOk: "Cambios guardados correctamente",
    lightTheme: "Claro", darkTheme: "Oscuro",
    spanish: "Español", english: "English",

    // Forgot password
    forgotTitle: "¿Olvidaste tu contraseña?",
    forgotDesc: "Ingresa tu correo y te enviaremos un código",
    sendCode: "Enviar código", sending: "Enviando...",
    enterCode: "Ingresa el código", code6digits: "Código de 6 dígitos",
    newPassword: "Nueva contraseña",
    confirmPassword: "Confirmar contraseña",
    changePassword: "Cambiar contraseña",
    useOtherEmail: "← Usar otro correo",
    passwordUpdated: "¡Contraseña actualizada!",
    canLoginNow: "Ya puedes iniciar sesión con tu nueva contraseña.",
    goToLogin: "Ir al inicio de sesión",
    backToLogin: "← Volver al inicio de sesión",

    // Tutor IA
    tutorTitle: "Tutor IA",
    tutorSubtitle: "Pregúntame sobre los temas del bachillerato",
    tutorPlaceholder: "Escribe tu pregunta aquí...",
    tutorSend: "Enviar",
    tutorThinking: "Pensando...",
    tutorError: "No se pudo obtener respuesta. Intenta de nuevo.",
    tutorWelcome: "¡Hola! Soy tu tutor de Estudios Sociales. Puedo explicarte cualquier tema del bachillerato costarricense. ¿Qué quieres aprender hoy?",
    cogiName: "Cogi",
    cogiGreeting: "¡Holi! 🐾 Soy Cogi, tu amigo inteligente de Cognia Lab. Puedo explicarte cualquier tema del bachillerato costarricense. ¿En qué te ayudo hoy?",
    cogiSubtitle: "Tu asistente de estudio inteligente",
    cogiPlaceholder: "Pregúntale algo a Cogi...",
    cogiSend: "Enviar",
    cogiThinking: "Cogi está pensando...",
    cogiError: "Ups, no pude responder. ¡Intenta de nuevo!",
    cogiClear: "Nueva conversación",
    cogiClose: "Cerrar",
  },  en: {
    appName: "Cognia Lab",
    subjects: "Subjects", progress: "Progress", news: "News",
    myAccount: "My Account", logout: "Sign Out", dashboard: "Dashboard",
    loading: "Loading...", exit: "Exit", cancel: "Cancel",
    back: "← Back", save: "Save", saving: "Saving...",

    hello: "Hello", practiceToday: "Practice today. Master the exam.",
    availableSubjects: "Available Subjects",
    subject: "subject", subjectsPlural: "subjects",
    yourProgress: "Your Progress", average: "Average",
    noProgress: "No progress yet",
    noProgressDesc: "Answer questions to see your progress here",
    newsTitle: "News & Updates",
    questionsAnswered: "Questions Answered",
    correctAnswers: "Correct Answers",
    accuracy: "Accuracy", topicsStudied: "Topics Studied",
    simulacroMEP: "MEP Exam Simulation",
    simulacroDesc: "50 questions · 90 minutes · Official bachillerato format",
    seeTopics: "See topics", generalProgress: "Overall Progress",
    correct: "Correct", incorrect: "Incorrect",

    topics: "Topics", mastered: "Mastered",
    inProgress: "In Progress", notStarted: "Not Started",
    progressLabel: "Progress", flashcards: "Flashcards",
    continuePractice: "Continue Practice", quiz3min: "3-min Quiz",
    backToSubjects: "← Back to Subjects",
    backToTopics: "← Back to Topics",

    question: "Question", of: "of",
    easy: "Easy", medium: "Medium", hard: "Hard",
    explanation: "Explanation", next: "Next",
    seeResults: "See Results", verifying: "Checking...",
    readText: "Read the following text and answer:",
    practiceCompleted: "Practice Completed",
    quizCompleted: "Quiz Completed",
    repeat: "Repeat",
    timeUp: "Time's up!", score: "Score",
    loadingQuestions: "Loading questions...",
    noQuestions: "No questions available",
    noQuestionsDesc: "This topic has no questions yet",
    excellentMsg: "Excellent command of the topic!",
    goodMsg: "Good job, keep practicing",
    keepGoingMsg: "Keep practicing, you'll improve",

    loadingFlashcards: "Loading flashcards...",
    deckCompleted: "Deck Completed", reviewCompleted: "Review Completed",
    dominated: "Mastered", toReview: "To Review",
    restartDeck: "Restart Full Deck",
    reviewWeak: "Review Difficult Cards",
    tapToReveal: "Tap to reveal the answer",
    answer: "Answer", iKnow: "I know it", iDontKnow: "Don't know",
    textReference: "Reference Text",
    tapCard: "Tap the card to see the answer",
    reviewMode: "(review)", dominatedAll: "You mastered all cards!",
    dominated_of: "You mastered", cards_of: "of", cardsLabel: "cards",

    simulacroTitle: "MEP Exam Simulation",
    officialFormat: "Bachillerato exam in the official MEP format",
    questions50: "50 single-choice questions",
    time90: "90-minute time limit",
    blockedOnTime: "Auto-blocked when time runs out",
    gradeScale: "Score on a 0–100 scale (passing: 70)",
    detailedReview: "Detailed answer review at the end",
    startSimulacro: "Start Simulation",
    answered: "answered", finish: "Finish",
    navigation: "Navigation", previous: "← Previous",
    finishExam: "Finish Exam",
    simulacroCompleted: "Simulation Completed",
    passed: "Passed! Great command of the content.",
    failed: "Not passed. Keep practicing to improve.",
    minToPass: "Score / 100 — Minimum to pass:",
    timeUsed: "Time used:", timeOf: "of",
    newSimulacro: "New Simulation", toDashboard: "Go to Dashboard",
    reviewAnswers: "Answer Review",
    seeContext: "See context text", unanswered: "Unanswered",
    timeExpired: "Time expired — exam automatically blocked",

    welcomeBack: "Welcome back",
    loginToContinue: "Sign in to continue studying",
    email: "Email", password: "Password",
    forgotPassword: "Forgot your password?",
    loginBtn: "Sign In", loggingIn: "Signing in...",
    noAccount: "Don't have an account?", registerFree: "Register for free",
    backToHome: "← Back to home",
    createAccount: "Create Account",
    startPreparing: "Start preparing for the bachillerato",
    name: "First Name", lastName: "Last Name", country: "Country",
    language: "Language", theme: "Theme",
    createBtn: "Create free account", creating: "Creating account...",
    alreadyAccount: "Already have an account?", loginLink: "Sign In",

    myAccountTitle: "My Account", saveChanges: "Save Changes",
    savedOk: "Changes saved successfully",
    lightTheme: "Light", darkTheme: "Dark",
    spanish: "Español", english: "English",

    forgotTitle: "Forgot your password?",
    forgotDesc: "Enter your email and we'll send you a code",
    sendCode: "Send Code", sending: "Sending...",
    enterCode: "Enter the code", code6digits: "6-digit code",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    changePassword: "Change Password",
    useOtherEmail: "← Use another email",
    passwordUpdated: "Password Updated!",
    canLoginNow: "You can now sign in with your new password.",
    goToLogin: "Go to Sign In",
    backToLogin: "← Back to Sign In",

    tutorTitle: "AI Tutor",
    tutorSubtitle: "Ask me about bachillerato topics",
    tutorPlaceholder: "Type your question here...",
    tutorSend: "Send",
    tutorThinking: "Thinking...",
    tutorError: "Could not get a response. Please try again.",
    tutorWelcome: "Hi! I'm your Social Studies tutor. I can explain any topic from the Costa Rican bachillerato. What would you like to learn today?",
    cogiName: "Cogi",
    cogiGreeting: "Holi! 🐾 I'm Cogi, your smart study buddy at Cognia Lab. I can explain any bachillerato topic for you. What do you need help with today?",
    cogiSubtitle: "Your intelligent study assistant",
    cogiPlaceholder: "Ask Cogi something...",
    cogiSend: "Send",
    cogiThinking: "Cogi is thinking...",
    cogiError: "Oops, couldn't respond. Try again!",
    cogiClear: "New conversation",
    cogiClose: "Close",
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
const LangCtx = createContext({ t: (k) => k })

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const u = JSON.parse(localStorage.getItem("user")) || {}
    return u.language || "es"
  })

  useEffect(() => {
    const sync = () => {
      const u = JSON.parse(localStorage.getItem("user")) || {}
      setLang(u.language || "es")
    }
    window.addEventListener("cognia:lang", sync)
    return () => window.removeEventListener("cognia:lang", sync)
  }, [])

  const t = (key) => (dict[lang] || dict.es)[key] ?? key

  return <LangCtx.Provider value={{ t, lang }}>{children}</LangCtx.Provider>
}

// ── Hooks ─────────────────────────────────────────────────────────────────────
export const useT = () => useContext(LangCtx).t
export const useLang = () => useContext(LangCtx).lang

// ── Disparar cambio de idioma (llamar después de guardar en Mi Cuenta) ────────
export const applyLang = () => window.dispatchEvent(new Event("cognia:lang"))
