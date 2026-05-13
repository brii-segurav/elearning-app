import hashlib
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    sha256 = hashlib.sha256(password.encode()).hexdigest()
    return pwd_context.hash(sha256)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    sha256 = hashlib.sha256(plain_password.encode()).hexdigest()
    return pwd_context.verify(sha256, hashed_password)
