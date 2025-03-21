from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.hash import bcrypt
from datetime import datetime, timedelta

from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.auth.schemas import UserCreate, UserLogin
import jwt
from src.config import ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY
from src.database import get_db


async def create_user(db: AsyncSession, user_data: UserCreate) -> User:
    user = User(
        email = user_data.email,
        hashed_password=bcrypt.hash(user_data.password),
        language=user_data.language
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    print(email)
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

async def auth_user(db: AsyncSession, creds: UserLogin) -> str | None:
    user = await get_user_by_email(db, creds.email)
    if not user:
        return None
    if not bcrypt.verify(creds.password, user.hashed_password):
        return None

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "sub": str(user.id),
        "exp": datetime.utcnow() + access_token_expires
    }
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def change_language(new_language: str, db: AsyncSession, user: User) -> User:
    user.language = new_language
    await db.commit()
    await db.refresh(user)
    return user