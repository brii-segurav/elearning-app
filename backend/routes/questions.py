import random
from fastapi import APIRouter
from sqlalchemy import text
from database import engine

router = APIRouter(tags=["Questions"])


def _format_question(row):
    """Convierte una fila de DB en dict de pregunta (sin correct/explanation)."""
    return {
        "id":           row[0],
        "topic_id":     row[1],
        "context_text": row[2],
        "question":     row[3],
        "option_a":     row[4],
        "option_b":     row[5],
        "option_c":     row[6],
        "option_d":     row[7],
        "difficulty":   row[8],
    }


@router.get("/questions/{topic_id}")
def get_questions(topic_id: int):
    """Todas las preguntas de un tema (para práctica libre)."""
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT id, topic_id, context_text, question,
                       option_a, option_b, option_c, option_d, difficulty
                FROM questions
                WHERE topic_id = :topic_id
                ORDER BY id
            """),
            {"topic_id": topic_id}
        ).fetchall()
    return [_format_question(r) for r in result]


@router.get("/quiz/{topic_id}")
def get_quiz(topic_id: int):
    """10 preguntas aleatorias de un tema (quiz cronometrado 3 min)."""
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT id, topic_id, context_text, question,
                       option_a, option_b, option_c, option_d, difficulty
                FROM questions
                WHERE topic_id = :topic_id
            """),
            {"topic_id": topic_id}
        ).fetchall()

    sample = random.sample(result, min(10, len(result)))
    return {
        "questions":      [_format_question(r) for r in sample],
        "time_limit_sec": 180,   # 3 minutos
        "type":           "quiz"
    }


@router.get("/simulacro")
def get_simulacro():
    """50 preguntas aleatorias de todos los temas (simulacro MEP 90 min)."""
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT id, topic_id, context_text, question,
                       option_a, option_b, option_c, option_d, difficulty
                FROM questions
                ORDER BY RANDOM()
                LIMIT 50
            """)
        ).fetchall()

    return {
        "questions":      [_format_question(r) for r in result],
        "time_limit_sec": 5400,  # 90 minutos
        "type":           "simulacro"
    }


@router.post("/exam-result")
def save_exam_result(body: dict):
    """Guarda el resultado de un quiz o simulacro."""
    user_id         = body.get("user_id")
    exam_type       = body.get("exam_type", "quiz")
    total           = body.get("total_questions", 0)
    correct         = body.get("correct_answers", 0)
    time_used       = body.get("time_used_seconds", 0)

    score = round((correct / total) * 100, 1) if total > 0 else 0.0

    with engine.connect() as conn:
        conn.execute(
            text("""
                INSERT INTO exam_results
                    (user_id, exam_type, total_questions, correct_answers, score, time_used_seconds)
                VALUES (:uid, :etype, :total, :correct, :score, :time)
            """),
            {"uid": user_id, "etype": exam_type, "total": total,
             "correct": correct, "score": score, "time": time_used}
        )
        conn.commit()

    return {"msg": "Resultado guardado", "score": score}


@router.get("/exam-results/{user_id}")
def get_exam_results(user_id: int):
    """Historial de simulacros y quizzes de un usuario."""
    with engine.connect() as conn:
        rows = conn.execute(
            text("""
                SELECT id, exam_type, total_questions, correct_answers,
                       score, time_used_seconds, created_at
                FROM exam_results
                WHERE user_id = :uid
                ORDER BY created_at DESC
                LIMIT 20
            """),
            {"uid": user_id}
        ).fetchall()

    return [
        {
            "id":               r[0],
            "exam_type":        r[1],
            "total_questions":  r[2],
            "correct_answers":  r[3],
            "score":            r[4],
            "time_used_seconds": r[5],
            "created_at":       r[6],
        }
        for r in rows
    ]
