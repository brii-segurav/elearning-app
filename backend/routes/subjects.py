from fastapi import APIRouter
from sqlalchemy import text
from database import engine

router = APIRouter(tags=["Subjects"])


@router.get("/subjects")
def get_subjects():
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT id, name, description FROM subjects ORDER BY id")
        ).fetchall()

    return [
        {"id": row[0], "name": row[1], "description": row[2]}
        for row in result
    ]
