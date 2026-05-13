from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import auth, subjects, topics, questions, attempts, progress

app = FastAPI(
    title="Cognia Lab API",
    description="Plataforma de preparación para el examen de bachillerato de Costa Rica",
    version="1.0.0"
)

# 🌐 CORS - Cross Origin Resource System
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🚀 Routers
app.include_router(auth.router)
app.include_router(subjects.router)
app.include_router(topics.router)
app.include_router(questions.router)
app.include_router(attempts.router)
app.include_router(progress.router)


@app.get("/", tags=["Root"])
def home():
    return {
        "app": "Cognia Lab API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }
