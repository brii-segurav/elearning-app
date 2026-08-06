from fastapi import APIRouter
from sqlalchemy import text
from database import engine

router = APIRouter(tags=["Search"])


@router.get("/search")
def search(q: str = "", limit: int = 20):
    if not q or len(q.strip()) < 1:
        return {"results": []}

    query = f"%{q.strip()}%"

    with engine.connect() as conn:
        # Buscar en materias
        subjects = conn.execute(text("""
            SELECT id, name, description, 'subject' as type
            FROM subjects
            WHERE name LIKE :q OR description LIKE :q
            LIMIT 5
        """), {"q": query}).fetchall()

        # Buscar en temas
        topics = conn.execute(text("""
            SELECT t.id, t.name, t.description, 'topic' as type,
                   s.name as subject_name, t.subject_id
            FROM topics t
            JOIN subjects s ON t.subject_id = s.id
            WHERE t.name LIKE :q OR t.description LIKE :q
            LIMIT 8
        """), {"q": query}).fetchall()

        # Buscar en preguntas
        questions = conn.execute(text("""
            SELECT q.id, q.question, q.difficulty, 'question' as type,
                   t.name as topic_name, t.id as topic_id,
                   s.name as subject_name
            FROM questions q
            JOIN topics t ON q.topic_id = t.id
            JOIN subjects s ON t.subject_id = s.id
            WHERE q.question LIKE :q OR q.context_text LIKE :q
            LIMIT 10
        """), {"q": query}).fetchall()

    results = []

    for r in subjects:
        results.append({
            "type":        "subject",
            "id":          r[0],
            "title":       r[1],
            "subtitle":    r[2] or "",
            "navigate_to": f"/topics/{r[0]}",
            "icon":        "book"
        })

    for r in topics:
        results.append({
            "type":        "topic",
            "id":          r[0],
            "title":       r[1],
            "subtitle":    r[4],  # subject_name
            "description": r[2] or "",
            "navigate_to": f"/topics/{r[5]}",
            "topic_id":    r[0],
            "icon":        "flag"
        })

    for r in questions:
        results.append({
            "type":        "question",
            "id":          r[0],
            "title":       r[1][:120] + ("..." if len(r[1]) > 120 else ""),
            "subtitle":    f"{r[6]} › {r[4]}",
            "difficulty":  r[2],
            "navigate_to": f"/questions/{r[5]}",
            "icon":        "question"
        })

    return {"results": results[:limit], "total": len(results)}
