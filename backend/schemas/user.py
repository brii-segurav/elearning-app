from pydantic import BaseModel


class UserRegister(BaseModel):
    email: str
    password: str
    name: str
    last_name: str
    country: str
    language: str = "es"
    theme: str = "light"


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    name: str
    last_name: str
    language: str
    theme: str
