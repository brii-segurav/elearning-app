from fastapi import APIRouter
from sqlalchemy import text
from database import engine
from schemas.user import UserRegister, UserLogin
from auth.security import hash_password, verify_password

router = APIRouter(tags=["Auth"])


@router.post("/register")
def register(user: UserRegister):
    if not user.email or not user.password:
        return {"error": "Datos incompletos"}

    hashed = hash_password(user.password)

    with engine.connect() as conn:
        # Verificar si el email ya existe
        existing = conn.execute(
            text("SELECT id FROM users WHERE email = :email"),
            {"email": user.email}
        ).fetchone()

        if existing:
            return {"error": "El correo ya está registrado"}

        conn.execute(
            text("""
                INSERT INTO users (email, password, name, last_name, country, language, theme)
                VALUES (:email, :password, :name, :last_name, :country, :language, :theme)
            """),
            {
                "email": user.email,
                "password": hashed,
                "name": user.name,
                "last_name": user.last_name,
                "country": user.country,
                "language": user.language,
                "theme": user.theme
            }
        )
        conn.commit()

    return {"msg": "Usuario creado exitosamente"}


@router.post("/login")
def login(user: UserLogin):
    if not user.email or not user.password:
        return {"error": "Datos incompletos"}

    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT * FROM users WHERE email = :email"),
            {"email": user.email}
        ).fetchone()

    if not result:
        return {"error": "Usuario no encontrado"}

    if verify_password(user.password, result[2]):
        return {
            "msg": "Inicio de sesión exitoso",
            "user": {
                "id": result[0],
                "email": result[1],
                "name": result[3],
                "last_name": result[4],
                "language": result[6],
                "theme": result[7]
            }
        }
    else:
        return {"error": "Contraseña incorrecta"}
