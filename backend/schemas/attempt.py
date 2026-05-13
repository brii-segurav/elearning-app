from pydantic import BaseModel


class AttemptIn(BaseModel):
    user_id: int
    question_id: int
    selected_answer: str  # 'A', 'B', 'C' o 'D'


class AttemptOut(BaseModel):
    is_correct: bool
    correct_answer: str
    explanation: str | None = None
