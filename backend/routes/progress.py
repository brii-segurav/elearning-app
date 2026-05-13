from fastapi import APIRouter
from sqlalchemy import text
from database import engine

router = APIRouter(tags=["Progress"])


@router.get("/progress/{user_id}")
def get_progress(user_id: int):
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT
                    p.topic_id,
                    t.name AS topic_name,
                    s.name AS subject_name,
                    p.completion_percentage,
                    COUNT(DISTINCT a.id) AS total_attempts,
                    SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END) AS correct_count
                FROM progress p
                JOIN topics t ON p.topic_id = t.id
                JOIN subjects s ON t.subject_id = s.id
                LEFT JOIN attempts a ON a.user_id = p.user_id AND a.question_id IN (
                    SELECT id FROM questions WHERE topic_id = p.topic_id
                )
                WHERE p.user_id = :uid
                GROUP BY p.topic_id, t.name, s.name, p.completion_percentage
                ORDER BY p.completion_percentage DESC
            """),
            {"uid": user_id}
        ).fetchall()

    topics_progress = [
        {
            "topic_id": row[0],
            "topic_name": row[1],
            "subject_name": row[2],
            "completion_percentage": float(row[3]),
            "total_attempts": row[4],
            "correct_count": row[5]
        }
        for row in result
    ]

    # Calcular promedio general
    overall = 0.0
    if topics_progress:
        overall = round(sum(t["completion_percentage"] for t in topics_progress) / len(topics_progress), 1)

    return {
        "user_id": user_id,
        "overall_percentage": overall,
        "topics": topics_progress
    }


@router.get("/stats/{user_id}")
def get_stats(user_id: int):
    with engine.connect() as conn:
        total = conn.execute(
            text("SELECT COUNT(*) FROM attempts WHERE user_id = :uid"),
            {"uid": user_id}
        ).scalar()

        correct = conn.execute(
            text("SELECT COUNT(*) FROM attempts WHERE user_id = :uid AND is_correct = true"),
            {"uid": user_id}
        ).scalar()

        topics_studied = conn.execute(
            text("""
                SELECT COUNT(DISTINCT q.topic_id)
                FROM attempts a
                JOIN questions q ON a.question_id = q.id
                WHERE a.user_id = :uid
            """),
            {"uid": user_id}
        ).scalar()

    accuracy = round((correct / total) * 100, 1) if total > 0 else 0.0

    return {
        "total_attempts": total,
        "correct_answers": correct,
        "accuracy_percentage": accuracy,
        "topics_studied": topics_studied
    }
