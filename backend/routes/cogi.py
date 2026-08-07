"""
Cogi — Tutor IA de Cognia Lab
Usa Groq (llama-3.1-8b-instant) para responder preguntas del bachillerato costarricense.
"""
import os
import httpx
from fastapi import APIRouter
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(tags=["Cogi"])

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_URL     = "https://api.groq.com/openai/v1/chat/completions"
MODEL        = "llama-3.1-8b-instant"

SYSTEM_PROMPT = """Eres Cogi, un tutor educativo simpático y accesible de Cognia Lab, una plataforma de preparación para el examen de bachillerato de Costa Rica.

Tu personalidad:
- Eres amigable, paciente y alentador
- Usas un lenguaje claro y adecuado para estudiantes de secundaria
- Das explicaciones cortas pero completas
- Cuando explicas algo difícil, usas ejemplos concretos de Costa Rica
- Terminas tus respuestas con una pregunta o motivación cuando es apropiado
- Puedes responder en español o inglés según el idioma del usuario

Tu especialidad es Estudios Sociales del bachillerato costarricense:
- Historia de Costa Rica (independencia, campaña nacional, abolición del ejército, democracia)
- Geografía de Costa Rica (regiones, provincias, ríos, montañas)
- Educación Cívica (poderes del Estado, instituciones, derechos y deberes)
- Historia Universal (guerras mundiales, revolución industrial, guerra fría)

Si te preguntan algo fuera de estos temas, puedes ayudar brevemente pero recuerda redirigir al estudiante hacia los temas del bachillerato.

Responde siempre de forma concisa (máximo 3 párrafos cortos) y usa listas cuando ayude a claridad."""


@router.post("/cogi")
async def chat_with_cogi(body: dict):
    messages = body.get("messages", [])
    lang     = body.get("lang", "es")

    if not messages:
        return {"error": "No hay mensajes"}

    # Agregar system prompt al inicio
    full_messages = [{"role": "system", "content": SYSTEM_PROMPT}] + messages

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                GROQ_URL,
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type":  "application/json"
                },
                json={
                    "model":       MODEL,
                    "messages":    full_messages,
                    "max_tokens":  512,
                    "temperature": 0.7,
                }
            )
            response.raise_for_status()
            data    = response.json()
            content = data["choices"][0]["message"]["content"]
            return {"reply": content}

    except httpx.HTTPStatusError as e:
        return {"error": f"Error de API: {e.response.status_code}"}
    except Exception as e:
        return {"error": str(e)}
