from fastapi import APIRouter
from sqlalchemy import text
from database import engine

router = APIRouter(tags=["Questions"])


@router.get("/questions/{topic_id}")
def get_questions(topic_id: int):
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT id, topic_id, question, option_a, option_b, option_c, option_d, difficulty
                FROM questions
                WHERE topic_id = :topic_id
                ORDER BY id
            """),
            {"topic_id": topic_id}
        ).fetchall()

    # IMPORTANTE: no se expone 'correct' ni 'explanation' al listar
    return [
        {
            "id": row[0],
            "topic_id": row[1],
            "question": row[2],
            "option_a": row[3],
            "option_b": row[4],
            "option_c": row[5],
            "option_d": row[6],
            "difficulty": row[7]
        }
        for row in result
    ]
