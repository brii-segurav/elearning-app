# Cognia Lab 🧪

Plataforma web de preparación para el examen de bachillerato de Costa Rica, enfocada en Estudios Sociales. Permite practicar con preguntas tipo MEP, realizar simulacros cronometrados y contar con un tutor inteligente.

---

## Características principales

- **Autenticación completa** — registro, login con JWT, recuperación de contraseña por correo
- **Quizzes cronometrados** — 10 preguntas aleatorias con límite de 3 minutos
- **Simulacro MEP** — 50 preguntas, 90 minutos, nota en escala 0-100
- **Flashcards** — tarjetas de estudio con modo de repaso inteligente
- **Tutor IA (Cogi)** — chatbot flotante powered by Groq (Llama 3.1)
- **Buscador inteligente** — búsqueda en tiempo real de materias, temas y preguntas
- **Multiidioma** — español e inglés con cambio instantáneo
- **Modo oscuro/claro** — tema guardado por usuario
- **Diseño responsive** — funciona en móvil, tablet y escritorio

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite |
| Backend | FastAPI (Python) |
| Base de datos | SQLite |
| Autenticación | JWT (python-jose) + bcrypt |
| IA | Groq API (Llama 3.1 8B) |
| Correo | Gmail SMTP |
| Estilos | CSS puro con variables |

---

## Estructura del proyecto

```
elearning-app/
├── backend/
│   ├── main.py              # Punto de entrada FastAPI
│   ├── database.py          # Conexión SQLite
│   ├── seed.py              # Datos iniciales
│   ├── seed_extra.py        # Preguntas adicionales estilo MEP
│   ├── auth/
│   │   └── security.py      # JWT + bcrypt
│   ├── routes/
│   │   ├── auth.py          # Login, register, reset password
│   │   ├── subjects.py      # Materias
│   │   ├── topics.py        # Temas
│   │   ├── questions.py     # Preguntas, quiz, simulacro
│   │   ├── attempts.py      # Intentos y progreso
│   │   ├── progress.py      # Estadísticas
│   │   ├── search.py        # Buscador
│   │   └── cogi.py          # Tutor IA
│   └── schemas/
│       ├── user.py
│       └── attempt.py
└── frontend/
    ├── public/
    │   └── icons.svg        # Sprite de íconos SVG
    └── src/
        ├── main.jsx         # Entrada React
        ├── i18n.jsx         # Sistema de traducciones
        ├── index.css        # Estilos globales
        ├── components/
        │   ├── Icon.jsx     # Componente de íconos
        │   ├── SearchBar.jsx
        │   └── Cogi.jsx     # Chatbot flotante
        ├── pages/
        │   ├── App.jsx
        │   ├── Landing.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── ForgotPassword.jsx
        │   ├── Dashboard.jsx
        │   ├── Topics.jsx
        │   ├── Questions.jsx
        │   ├── Flashcards.jsx
        │   └── Simulacro.jsx
        └── services/
            └── api.js       # Cliente HTTP
```

---

## Instalación y uso local

### Requisitos
- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend
pip install fastapi uvicorn sqlalchemy bcrypt python-jose[cryptography] httpx
python seed.py
python seed_extra.py
python -m uvicorn main:app --reload
```

El backend queda disponible en `http://127.0.0.1:8000`  
Documentación de la API: `http://127.0.0.1:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend queda disponible en `http://localhost:5173`

---

## Base de datos

SQLite — archivo `backend/elearning.db` (se crea automáticamente al arrancar).

### Tablas

| Tabla | Descripción |
|-------|-------------|
| `users` | Usuarios registrados |
| `subjects` | Materias (ej: Estudios Sociales) |
| `topics` | Temas por materia |
| `questions` | Preguntas con opciones A-D y texto de contexto |
| `attempts` | Intentos de respuesta por usuario |
| `progress` | Porcentaje de avance por tema |
| `exam_results` | Resultados de quizzes y simulacros |
| `reset_codes` | Códigos temporales de recuperación de contraseña |

---

## Variables de entorno

Opcionalmente se pueden configurar como variables de entorno:

```env
GMAIL_USER=labcognia@gmail.com
GMAIL_PASSWORD=tu_contraseña_de_app
GROQ_API_KEY=tu_api_key_de_groq
```

---

## Rutas de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/register` | Crear cuenta |
| POST | `/login` | Iniciar sesión |
| POST | `/forgot-password` | Solicitar código de reset |
| POST | `/reset-password` | Cambiar contraseña con código |
| GET | `/subjects` | Listar materias |
| GET | `/topics/{subject_id}` | Temas de una materia |
| GET | `/questions/{topic_id}` | Preguntas de un tema |
| GET | `/quiz/{topic_id}` | 10 preguntas aleatorias (quiz) |
| GET | `/simulacro` | 50 preguntas aleatorias |
| POST | `/attempt` | Registrar respuesta |
| GET | `/progress/{user_id}` | Progreso del usuario |
| GET | `/stats/{user_id}` | Estadísticas generales |
| GET | `/search?q=` | Búsqueda global |
| POST | `/cogi` | Chat con tutor IA |
| POST | `/exam-result` | Guardar resultado de examen |

---

## Créditos

Desarrollado como proyecto de bachillerato técnico.  
Datos de Estudios Sociales basados en el programa oficial del MEP (Ministerio de Educación Pública de Costa Rica).  
IA powered by [Groq](https://groq.com) — Llama 3.1 8B Instant.
