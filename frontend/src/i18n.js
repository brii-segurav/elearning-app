/**
 * Sistema de internacionalización simple sin dependencias externas.
 * Uso: const t = useTranslation()  →  t("subjects")
 */

export const translations = {
  es: {
    // Navbar
    subjects:        "Materias",
    progress:        "Progreso",
    news:            "Noticias",
    myAccount:       "Mi cuenta",
    logout:          "Salir",
    dashboard:       "Dashboard",

    // Dashboard
    hello:           "Hola",
    practiceToday:   "Practica hoy. Domina el examen.",
    availableSubjects: "Materias disponibles",
    subject:         "materia",
    subjects_plural: "materias",
    yourProgress:    "Tu progreso",
    average:         "Promedio",
    noProgress:      "Sin progreso aún",
    noProgressDesc:  "Responde preguntas para ver tu avance aquí",
    newsTitle:       "Noticias y actualizaciones",
    questionsAnswered: "Preguntas respondidas",
    correctAnswers:  "Respuestas correctas",
    accuracy:        "Precisión",
    topicsStudied:   "Temas estudiados",
    simulacroMEP:    "Simulacro MEP",
    simulacroDesc:   "50 preguntas · 90 minutos · Formato oficial del bachillerato",

    // Topics
    topics:          "Temas",
    mastered:        "Dominado",
    inProgress:      "En progreso",
    notStarted:      "Sin iniciar",
    progressLabel:   "Progreso",
    flashcards:      "Flashcards",
    continuePractice: "Continuar práctica",
    quiz3min:        "Quiz 3 min",
    backToSubjects:  "← Volver a materias",

    // Questions / Quiz
    question:        "Pregunta",
    of:              "de",
    correct:         "Correctas",
    incorrect:       "Incorrectas",
    easy:            "Fácil",
    medium:          "Medio",
    hard:            "Difícil",
    explanation:     "Explicación",
    next:            "Siguiente",
    seeResults:      "Ver resultados",
    verifying:       "Verificando...",
    readText:        "Lea el siguiente texto y responda:",
    practiceCompleted: "Práctica completada",
    quizCompleted:   "Quiz completado",
    repeat:          "Repetir",
    backToTopics:    "← Volver a temas",
    timeUp:          "¡Se acabó el tiempo!",
    score:           "Puntuación",
    exit:            "Salir",
    loading:         "Cargando...",
    loadingQuestions: "Cargando preguntas...",
    noQuestions:     "Sin preguntas disponibles",
    noQuestionsDesc: "Este tema aún no tiene preguntas cargadas",

    // Flashcards
    loadingFlashcards: "Cargando flashcards...",
    deckCompleted:   "Mazo completado",
    reviewCompleted: "Repaso completado",
    dominated:       "Dominadas",
    toReview:        "Por repasar",
    restartDeck:     "Reiniciar mazo completo",
    reviewWeak:      "Repasar las difíciles",
    backToTopicsFlash: "← Volver a temas",
    tapToReveal:     "Pregunta — toca para revelar",
    answer:          "Respuesta",
    iKnow:           "Lo sé",
    iDontKnow:       "No lo sé",
    textReference:   "Texto de referencia",
    tapCard:         "Toca la tarjeta para ver la respuesta",
    review:          "(repaso)",

    // Simulacro
    simulacroTitle:  "Simulacro MEP",
    officialFormat:  "Examen de bachillerato en el formato oficial del Ministerio de Educación Pública",
    questions50:     "50 preguntas de selección única",
    time90:          "90 minutos de tiempo máximo",
    blockedOnTime:   "Al terminar el tiempo se bloquea automáticamente",
    gradeScale:      "Nota en escala del 0 al 100 (aprobado: 70)",
    detailedReview:  "Revisión detallada de respuestas al finalizar",
    cancel:          "Cancelar",
    startSimulacro:  "Comenzar simulacro",
    answered:        "respondidas",
    finish:          "Terminar",
    navigation:      "Navegación",
    previous:        "← Anterior",
    finishExam:      "Finalizar examen",
    simulacroCompleted: "Simulacro completado",
    passed:          "¡Aprobado! Buen dominio del contenido.",
    failed:          "No aprobado. Sigue practicando para mejorar.",
    minToPass:       "Nota / 100 — Mínimo para aprobar:",
    timeUsed:        "Tiempo utilizado:",
    timeOf:          "de",
    newSimulacro:    "Nuevo simulacro",
    toDashboard:     "Ir al Dashboard",
    reviewAnswers:   "Revisión de respuestas",
    seeContext:      "Ver texto de contexto",
    unanswered:      "Sin responder",
    timeExpired:     "Tiempo agotado — examen bloqueado automáticamente",

    // Auth
    welcomeBack:     "Bienvenido de vuelta",
    loginToContinue: "Inicia sesión para continuar estudiando",
    email:           "Correo electrónico",
    password:        "Contraseña",
    forgotPassword:  "¿Olvidaste tu contraseña?",
    loginBtn:        "Iniciar sesión",
    loggingIn:       "Iniciando sesión...",
    noAccount:       "¿No tienes cuenta?",
    registerFree:    "Regístrate gratis",
    backToHome:      "← Volver al inicio",
    createAccount:   "Crear cuenta",
    startPreparing:  "Empieza a prepararte para el bachillerato",
    name:            "Nombre",
    lastName:        "Apellido",
    country:         "País",
    language:        "Idioma",
    theme:           "Tema",
    createBtn:       "Crear cuenta gratis",
    creating:        "Creando cuenta...",
    alreadyAccount:  "¿Ya tienes cuenta?",
    loginLink:       "Iniciar sesión",

    // Account
    myAccountTitle:  "Mi cuenta",
    saveChanges:     "Guardar cambios",
    savedOk:         "Cambios guardados correctamente",
    lightTheme:      "Claro",
    darkTheme:       "Oscuro",
    spanish:         "Español",
    english:         "English",

    // Forgot password
    forgotTitle:     "¿Olvidaste tu contraseña?",
    forgotDesc:      "Ingresa tu correo y te enviaremos un código de verificación",
    sendCode:        "Enviar código",
    sending:         "Enviando...",
    enterCode:       "Ingresa el código",
    code6digits:     "Código de 6 dígitos",
    newPassword:     "Nueva contraseña",
    confirmPassword: "Confirmar contraseña",
    changePassword:  "Cambiar contraseña",
    saving:          "Guardando...",
    useOtherEmail:   "← Usar otro correo",
    passwordUpdated: "¡Contraseña actualizada!",
    canLoginNow:     "Ya puedes iniciar sesión con tu nueva contraseña.",
    goToLogin:       "Ir al inicio de sesión",
    backToLogin:     "← Volver al inicio de sesión",
  },

  en: {
    // Navbar
    subjects:        "Subjects",
    progress:        "Progress",
    news:            "News",
    myAccount:       "My Account",
    logout:          "Sign Out",
    dashboard:       "Dashboard",

    // Dashboard
    hello:           "Hello",
    practiceToday:   "Practice today. Master the exam.",
    availableSubjects: "Available Subjects",
    subject:         "subject",
    subjects_plural: "subjects",
    yourProgress:    "Your Progress",
    average:         "Average",
    noProgress:      "No progress yet",
    noProgressDesc:  "Answer questions to see your progress here",
    newsTitle:       "News & Updates",
    questionsAnswered: "Questions Answered",
    correctAnswers:  "Correct Answers",
    accuracy:        "Accuracy",
    topicsStudied:   "Topics Studied",
    simulacroMEP:    "MEP Exam Simulation",
    simulacroDesc:   "50 questions · 90 minutes · Official bachillerato format",

    // Topics
    topics:          "Topics",
    mastered:        "Mastered",
    inProgress:      "In Progress",
    notStarted:      "Not Started",
    progressLabel:   "Progress",
    flashcards:      "Flashcards",
    continuePractice: "Continue Practice",
    quiz3min:        "3-min Quiz",
    backToSubjects:  "← Back to Subjects",

    // Questions / Quiz
    question:        "Question",
    of:              "of",
    correct:         "Correct",
    incorrect:       "Incorrect",
    easy:            "Easy",
    medium:          "Medium",
    hard:            "Hard",
    explanation:     "Explanation",
    next:            "Next",
    seeResults:      "See Results",
    verifying:       "Checking...",
    readText:        "Read the following text and answer:",
    practiceCompleted: "Practice Completed",
    quizCompleted:   "Quiz Completed",
    repeat:          "Repeat",
    backToTopics:    "← Back to Topics",
    timeUp:          "Time's up!",
    score:           "Score",
    exit:            "Exit",
    loading:         "Loading...",
    loadingQuestions: "Loading questions...",
    noQuestions:     "No questions available",
    noQuestionsDesc: "This topic has no questions yet",

    // Flashcards
    loadingFlashcards: "Loading flashcards...",
    deckCompleted:   "Deck Completed",
    reviewCompleted: "Review Completed",
    dominated:       "Mastered",
    toReview:        "To Review",
    restartDeck:     "Restart Full Deck",
    reviewWeak:      "Review Difficult Cards",
    backToTopicsFlash: "← Back to Topics",
    tapToReveal:     "Question — tap to reveal",
    answer:          "Answer",
    iKnow:           "I know it",
    iDontKnow:       "Don't know",
    textReference:   "Reference Text",
    tapCard:         "Tap the card to see the answer",
    review:          "(review)",

    // Simulacro
    simulacroTitle:  "MEP Exam Simulation",
    officialFormat:  "Bachillerato exam in the official Ministry of Education format",
    questions50:     "50 single-choice questions",
    time90:          "90-minute time limit",
    blockedOnTime:   "Auto-blocked when time runs out",
    gradeScale:      "Score on a 0–100 scale (passing: 70)",
    detailedReview:  "Detailed answer review at the end",
    cancel:          "Cancel",
    startSimulacro:  "Start Simulation",
    answered:        "answered",
    finish:          "Finish",
    navigation:      "Navigation",
    previous:        "← Previous",
    finishExam:      "Finish Exam",
    simulacroCompleted: "Simulation Completed",
    passed:          "Passed! Great command of the content.",
    failed:          "Not passed. Keep practicing to improve.",
    minToPass:       "Score / 100 — Minimum to pass:",
    timeUsed:        "Time used:",
    timeOf:          "of",
    newSimulacro:    "New Simulation",
    toDashboard:     "Go to Dashboard",
    reviewAnswers:   "Answer Review",
    seeContext:      "See context text",
    unanswered:      "Unanswered",
    timeExpired:     "Time expired — exam automatically blocked",

    // Auth
    welcomeBack:     "Welcome back",
    loginToContinue: "Sign in to continue studying",
    email:           "Email",
    password:        "Password",
    forgotPassword:  "Forgot your password?",
    loginBtn:        "Sign In",
    loggingIn:       "Signing in...",
    noAccount:       "Don't have an account?",
    registerFree:    "Register for free",
    backToHome:      "← Back to home",
    createAccount:   "Create Account",
    startPreparing:  "Start preparing for the bachillerato",
    name:            "First Name",
    lastName:        "Last Name",
    country:         "Country",
    language:        "Language",
    theme:           "Theme",
    createBtn:       "Create free account",
    creating:        "Creating account...",
    alreadyAccount:  "Already have an account?",
    loginLink:       "Sign In",

    // Account
    myAccountTitle:  "My Account",
    saveChanges:     "Save Changes",
    savedOk:         "Changes saved successfully",
    lightTheme:      "Light",
    darkTheme:       "Dark",
    spanish:         "Español",
    english:         "English",

    // Forgot password
    forgotTitle:     "Forgot your password?",
    forgotDesc:      "Enter your email and we'll send you a verification code",
    sendCode:        "Send Code",
    sending:         "Sending...",
    enterCode:       "Enter the code",
    code6digits:     "6-digit code",
    newPassword:     "New Password",
    confirmPassword: "Confirm Password",
    changePassword:  "Change Password",
    saving:          "Saving...",
    useOtherEmail:   "← Use another email",
    passwordUpdated: "Password Updated!",
    canLoginNow:     "You can now sign in with your new password.",
    goToLogin:       "Go to Sign In",
    backToLogin:     "← Back to Sign In",
  }
}

/** Hook que devuelve la función t() reactiva al idioma del usuario */
import { useState, useEffect } from "react"

export function useTranslation() {
  const [lang, setLang] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {}
    return user.language || "es"
  })

  useEffect(() => {
    const handler = () => {
      const user = JSON.parse(localStorage.getItem("user")) || {}
      setLang(user.language || "es")
    }
    window.addEventListener("languagechange", handler)
    window.addEventListener("storage", handler)
    return () => {
      window.removeEventListener("languagechange", handler)
      window.removeEventListener("storage", handler)
    }
  }, [])

  const dict = translations[lang] || translations.es
  return (key) => dict[key] ?? key
}

/** Dispara el evento para que todos los componentes actualicen su idioma */
export function notifyLanguageChange() {
  window.dispatchEvent(new Event("languagechange"))
}
