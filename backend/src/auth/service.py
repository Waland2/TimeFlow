from http.client import HTTPException
from typing import Optional

from fastapi.openapi.utils import status_code_ranges
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.hash import bcrypt
from starlette import status

from src.auth.models import User
import jwt

from src.card.models import Card
from src.config import ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, DEFAULT_CARDS
from datetime import datetime, timedelta

async def create_user(db: AsyncSession, email: str, password: str, language: Optional[str] = None) -> User:
    email = email.strip()
    password = password.strip()


    user = User(
        email=email,
        hashed_password=bcrypt.hash(password),
        language=language
    )
    db.add(user)
    await db.flush()

    for card_data in DEFAULT_CARDS:
        card = Card(**card_data, user_id=user.id)
        db.add(card)

    await db.flush()
    await db.commit()
    await db.refresh(user)
    return user

async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    email = email.strip()
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

async def auth_user(db: AsyncSession, email: str, password: str) -> str | None:
    email = email.strip()
    password = password.strip()
    user = await get_user_by_email(db, email)
    if not user:
        return None
    if not bcrypt.verify(password, user.hashed_password):
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