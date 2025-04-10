from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    username: Optional[str] = None
    language: str = "eng"
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    email: EmailStr
    language: str = "eng"

    class Config: 
        orm_model = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LanguageUpdate(BaseModel):
    new_language: str

class EmailConfirmation(BaseModel):
    token: str
    new_password: str

class PasswordResetRequest(BaseModel):
    email: str

class PasswordReset(BaseModel):
    token: str
    new_password: str