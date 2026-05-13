from fastapi import APIRouter
from sqlalchemy import text
from database import engine
from schemas.attempt import AttemptIn

router = APIRouter(tags=["Attempts"])


@router.post("/attempt")
def save_attempt(attempt: AttemptIn):
    with engine.connect() as conn:
        # Obtener la respuesta correcta y explicación
        question = conn.execute(
            text('SELECT correct, explanation, topic_id FROM questions WHERE id = :qid'),
            {"qid": attempt.question_id}
        ).fetchone()

        if not question:
            return {"error": "Pregunta no encontrada"}

        correct_answer = question[0]
        explanation = question[1]
        topic_id = question[2]
        is_correct = attempt.selected_answer.upper() == correct_answer.upper()

        # Guardar el intento
        conn.execute(
            text("""
                INSERT INTO attempts (user_id, question_id, selected_answer, is_correct)
                VALUES (:user_id, :question_id, :selected_answer, :is_correct)
            """),
            {
                "user_id": attempt.user_id,
                "question_id": attempt.question_id,
                "selected_answer": attempt.selected_answer.upper(),
                "is_correct": is_correct
            }
        )

        # Actualizar progreso del tema
        total_questions = conn.execute(
            text("SELECT COUNT(*) FROM questions WHERE topic_id = :tid"),
            {"tid": topic_id}
        ).scalar()

        correct_count = conn.execute(
            text("""
                SELECT COUNT(*) FROM attempts a
                JOIN questions q ON a.question_id = q.id
                WHERE a.user_id = :uid AND q.topic_id = :tid AND a.is_correct = true
            """),
            {"uid": attempt.user_id, "tid": topic_id}
        ).scalar()

        percentage = round((correct_count / total_questions) * 100, 1) if total_questions > 0 else 0.0

        # Upsert en progress
        conn.execute(
            text("""
                INSERT INTO progress (user_id, topic_id, completion_percentage, updated_at)
                VALUES (:uid, :tid, :pct, NOW())
                ON CONFLICT (user_id, topic_id)
                DO UPDATE SET completion_percentage = :pct, updated_at = NOW()
            """),
            {"uid": attempt.user_id, "tid": topic_id, "pct": percentage}
        )

        conn.commit()

    return {
        "is_correct": is_correct,
        "correct_answer": correct_answer,
        "explanation": explanation
    }
