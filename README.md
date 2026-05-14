# Cognia Lab

> **Practica hoy. Domina el examen.**

Plataforma de e-learning para la preparación del examen de bachillerato de Costa Rica.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite |
| Backend | FastAPI (Python) |
| Base de datos | SQLite (archivo `elearning.db`) |
| ORM | SQLAlchemy |
| Seguridad | passlib + bcrypt + SHA-256 |
| Routing | React Router DOM |

---

## Estructura del proyecto

```
elearning-app/
├── backend/
│   ├── main.py          # Entry point FastAPI
│   ├── database.py      # Conexión SQLite
│   ├── seed.py          # Crea tablas y carga datos iniciales
│   ├── auth/
│   │   └── security.py  # Hash y verificación de contraseñas
│   ├── routes/
│   │   ├── auth.py      # POST /register, POST /login
│   │   ├── subjects.py  # GET /subjects
│   │   ├── topics.py    # GET /topics/{subject_id}
│   │   ├── questions.py # GET /questions/{topic_id}
│   │   ├── attempts.py  # POST /attempt
│   │   └── progress.py  # GET /progress/{user_id}, GET /stats/{user_id}
│   └── schemas/
│       ├── user.py
│       └── attempt.py
└── frontend/
    └── src/
        ├── main.jsx
        ├── index.css
        ├── components/
        │   └── Icon.jsx         # Componente de iconos SVG
        ├── services/
        │   └── api.js           # Cliente HTTP centralizado
        └── pages/
            ├── App.jsx          # Rutas
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── Topics.jsx
            └── Questions.jsx
```

---

## Instalación y ejecución

### Requisitos previos
- Python 3.10+
- Node.js 18+

> No se requiere instalar PostgreSQL ni ninguna base de datos externa.
> SQLite viene incluido con Python y crea el archivo `elearning.db` automáticamente.

### Backend

```bash
cd backend

# Activar entorno virtual
.venv\Scripts\activate          # Windows
source .venv/bin/activate       # Linux/Mac

# Instalar dependencias
pip install fastapi uvicorn sqlalchemy passlib bcrypt pydantic

# Crear tablas y cargar datos iniciales (solo la primera vez)
python seed.py

# Iniciar servidor
uvicorn main:app --reload
```

API disponible en: http://127.0.0.1:8000  
Documentación Swagger: http://127.0.0.1:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App disponible en: http://localhost:5173

---

## Base de datos

Ver [docs/DATABASE.md](docs/DATABASE.md) para el esquema completo.

La base de datos es SQLite. El archivo `elearning.db` se crea automáticamente al correr `python seed.py`.
No se necesita ninguna configuración adicional.

---

## API Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Estado de la API |
| POST | `/register` | Registrar usuario |
| POST | `/login` | Iniciar sesión |
| GET | `/subjects` | Listar materias |
| GET | `/topics/{subject_id}` | Temas de una materia |
| GET | `/questions/{topic_id}` | Preguntas de un tema |
| POST | `/attempt` | Guardar respuesta |
| GET | `/progress/{user_id}` | Progreso del usuario |
| GET | `/stats/{user_id}` | Estadísticas del usuario |

---

## Estado del MVP (75-80%)

### Implementado
- Registro e inicio de sesión con hash seguro
- Dashboard con estadísticas reales
- Navegación por materias, temas y preguntas
- Sistema de preguntas interactivo con feedback inmediato
- Guardado de intentos en base de datos
- Cálculo automático de progreso por tema
- Modo oscuro / claro
- Diseño responsive
- Iconos SVG en toda la interfaz (sin emojis)

### Pendiente (20-25%)
- Simulacros cronometrados completos
- JWT para autenticación stateless
- Más materias (Matemática, Español, Ciencias, Inglés)
- Tutor IA con LLM
- Despliegue en producción

---

## Uso de IA en el desarrollo

Se utilizó **Kiro (Amazon)** como asistente de desarrollo para:
- Diseño de arquitectura modular del backend
- Generación del sistema de CSS con variables para temas
- Estructura de componentes React
- Lógica del cálculo de progreso desde `attempts`
- Migración de PostgreSQL a SQLite
- Sistema de iconos SVG

Todo el código generado fue revisado, adaptado y comprendido antes de integrarse al proyecto.
