from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from database import engine
from routes import auth, subjects, topics, questions, attempts, progress, search, cogi


def create_tables():
    with engine.connect() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                name TEXT,
                last_name TEXT,
                country TEXT,
                language TEXT DEFAULT 'es',
                theme TEXT DEFAULT 'light',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS subjects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT
            )
        """))
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS topics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                subject_id INTEGER REFERENCES subjects(id),
                name TEXT NOT NULL,
                description TEXT,
                order_index INTEGER DEFAULT 0
            )
        """))
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                topic_id INTEGER REFERENCES topics(id),
                context_text TEXT,
                question TEXT NOT NULL,
                option_a TEXT,
                option_b TEXT,
                option_c TEXT,
                option_d TEXT,
                correct TEXT,
                explanation TEXT,
                difficulty TEXT DEFAULT 'medium'
            )
        """))
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS attempts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER REFERENCES users(id),
                question_id INTEGER REFERENCES questions(id),
                selected_answer TEXT,
                is_correct INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER REFERENCES users(id),
                topic_id INTEGER REFERENCES topics(id),
                completion_percentage REAL DEFAULT 0.0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, topic_id)
            )
        """))
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS reset_codes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER REFERENCES users(id),
                code TEXT NOT NULL,
                expires_at TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS exam_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER REFERENCES users(id),
                exam_type TEXT NOT NULL,
                total_questions INTEGER,
                correct_answers INTEGER,
                score REAL,
                time_used_seconds INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))
        conn.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield


app = FastAPI(
    title="Cognia Lab API",
    description="Plataforma de preparación para el examen de bachillerato de Costa Rica",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(subjects.router)
app.include_router(topics.router)
app.include_router(questions.router)
app.include_router(attempts.router)
app.include_router(progress.router)
app.include_router(search.router)
app.include_router(cogi.router)


@app.get("/", tags=["Root"])
def home():
    return {
        "app": "Cognia Lab API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }
