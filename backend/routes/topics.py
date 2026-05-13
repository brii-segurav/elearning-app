from fastapi import APIRouter
from sqlalchemy import text
from database import engine

router = APIRouter(tags=["Topics"])


@router.get("/topics/{subject_id}")
def get_topics(subject_id: int):
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT id, name, description, order_index
                FROM topics
                WHERE subject_id = :subject_id
                ORDER BY order_index ASC
            """),
            {"subject_id": subject_id}
        ).fetchall()

    return [
        {
            "id": row[0],
            "name": row[1],
            "description": row[2],
            "order_index": row[3]
        }
        for row in result
    ]
