import random
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Header, HTTPException
from sqlalchemy import text
from database import engine
from schemas.user import UserRegister, UserLogin
from auth.security import hash_password, verify_password, create_access_token, decode_access_token

router = APIRouter(tags=["Auth"])

# ── Config correo (se llena cuando tengamos las credenciales) ─────────────────
GMAIL_USER     = os.getenv("GMAIL_USER", "labcognia@gmail.com")
GMAIL_PASSWORD = os.getenv("GMAIL_PASSWORD", "oqmhzourkmenjouv")


def send_reset_email(to_email: str, code: str):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Código de recuperación - Cognia Lab"
    msg["From"]    = GMAIL_USER
    msg["To"]      = to_email

    html = f"""
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:2rem;
                border-radius:12px;border:1px solid #e5e7eb">
      <h2 style="color:#6366f1;margin-bottom:.5rem">Cognia Lab</h2>
      <p>Recibimos una solicitud para restablecer tu contraseña.</p>
      <p>Tu código de verificación es:</p>
      <div style="font-size:2.5rem;font-weight:700;letter-spacing:.5rem;
                  color:#6366f1;text-align:center;padding:1.5rem 0">
        {code}
      </div>
      <p style="color:#6b7280;font-size:.9rem">
        Este código expira en <strong>15 minutos</strong>.<br>
        Si no solicitaste esto, ignora este mensaje.
      </p>
    </div>
    """
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(GMAIL_USER, GMAIL_PASSWORD)
        server.sendmail(GMAIL_USER, to_email, msg.as_string())


# ── Test correo (solo para diagnóstico) ───────────────────────────────────────
@router.post("/test-email")
def test_email(body: dict):
    to = body.get("to", GMAIL_USER)
    try:
        send_reset_email(to, "123456")
        return {"msg": f"Correo enviado a {to}"}
    except Exception as e:
        return {"error": str(e), "gmail_user": GMAIL_USER, "password_len": len(GMAIL_PASSWORD)}


# ── Register ──────────────────────────────────────────────────────────────────
@router.post("/register")
def register(user: UserRegister):
    if not user.email or not user.password:
        return {"error": "Datos incompletos"}

    hashed = hash_password(user.password)

    with engine.connect() as conn:
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
                "email":     user.email,
                "password":  hashed,
                "name":      user.name,
                "last_name": user.last_name,
                "country":   user.country,
                "language":  user.language,
                "theme":     user.theme,
            }
        )
        conn.commit()

    return {"msg": "Usuario creado exitosamente"}


# ── Login ─────────────────────────────────────────────────────────────────────
@router.post("/login")
def login(user: UserLogin):
    if not user.email or not user.password:
        return {"error": "Datos incompletos"}

    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT id, email, password, name, last_name, country, language, theme FROM users WHERE email = :email"),
            {"email": user.email}
        ).fetchone()

    if not result:
        return {"error": "Usuario no encontrado"}

    if not verify_password(user.password, result[2]):
        return {"error": "Contraseña incorrecta"}

    token = create_access_token({"sub": str(result[0]), "email": result[1]})

    return {
        "msg": "Inicio de sesión exitoso",
        "token": token,
        "user": {
            "id":        result[0],
            "email":     result[1],
            "name":      result[3],
            "last_name": result[4],
            "country":   result[5],
            "language":  result[6],
            "theme":     result[7],
        }
    }


# ── Forgot password ───────────────────────────────────────────────────────────
@router.post("/forgot-password")
def forgot_password(body: dict):
    email = body.get("email", "").strip().lower()
    if not email:
        return {"error": "Correo requerido"}

    with engine.connect() as conn:
        user = conn.execute(
            text("SELECT id FROM users WHERE email = :email"),
            {"email": email}
        ).fetchone()

        if not user:
            # No revelar si el correo existe o no (seguridad)
            return {"msg": "Si el correo existe, recibirás un código"}

        code = str(random.randint(100000, 999999))
        expires_at = (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()

        # Borrar códigos anteriores del mismo usuario
        conn.execute(
            text("DELETE FROM reset_codes WHERE user_id = :uid"),
            {"uid": user[0]}
        )
        conn.execute(
            text("INSERT INTO reset_codes (user_id, code, expires_at) VALUES (:uid, :code, :exp)"),
            {"uid": user[0], "code": code, "exp": expires_at}
        )
        conn.commit()

    try:
        send_reset_email(email, code)
    except Exception as e:
        return {"error": f"No se pudo enviar el correo: {str(e)}"}

    return {"msg": "Si el correo existe, recibirás un código"}


# ── Reset password ────────────────────────────────────────────────────────────
@router.post("/reset-password")
def reset_password(body: dict):
    email    = body.get("email", "").strip().lower()
    code     = body.get("code", "").strip()
    password = body.get("password", "")

    if not email or not code or not password:
        return {"error": "Datos incompletos"}

    with engine.connect() as conn:
        user = conn.execute(
            text("SELECT id FROM users WHERE email = :email"),
            {"email": email}
        ).fetchone()

        if not user:
            return {"error": "Correo no encontrado"}

        record = conn.execute(
            text("SELECT code, expires_at FROM reset_codes WHERE user_id = :uid ORDER BY id DESC LIMIT 1"),
            {"uid": user[0]}
        ).fetchone()

        if not record:
            return {"error": "No hay código de recuperación activo"}

        if record[0] != code:
            return {"error": "Código incorrecto"}

        expires_at = datetime.fromisoformat(record[1])
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        if datetime.now(timezone.utc) > expires_at:
            return {"error": "El código ha expirado"}

        hashed = hash_password(password)
        conn.execute(
            text("UPDATE users SET password = :pwd WHERE id = :uid"),
            {"pwd": hashed, "uid": user[0]}
        )
        conn.execute(
            text("DELETE FROM reset_codes WHERE user_id = :uid"),
            {"uid": user[0]}
        )
        conn.commit()

    return {"msg": "Contraseña actualizada correctamente"}


# ── Verify token (para proteger rutas) ───────────────────────────────────────
@router.get("/me")
def get_me(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token requerido")

    token = authorization.split(" ")[1]
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    with engine.connect() as conn:
        user = conn.execute(
            text("SELECT id, email, name, last_name, country, language, theme FROM users WHERE id = :uid"),
            {"uid": int(payload["sub"])}
        ).fetchone()

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return {
        "id":        user[0],
        "email":     user[1],
        "name":      user[2],
        "last_name": user[3],
        "country":   user[4],
        "language":  user[5],
        "theme":     user[6],
    }
