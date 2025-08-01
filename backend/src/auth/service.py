from typing import Optional

from fastapi import HTTPException
from fastapi.openapi.utils import status_code_ranges
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.hash import bcrypt
from starlette import status

from src.auth.models import User
import jwt

from src.auth.schemas import EmailConfirmation
from src.card.models import Card
from src.config import ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, EMAILS_ENABLED, SECRET_KEY, DEFAULT_CARDS
from datetime import datetime, timedelta

from src.mail.service import send_confirm_mail, send_password_reset_mail


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
        

    if EMAILS_ENABLED:
        confirm_email_token =  jwt.encode({
            "sub": email,
            "exp": datetime.utcnow() + timedelta(hours=256)
        }, SECRET_KEY, algorithm="HS256")

        if not await send_confirm_mail(email, confirm_email_token):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email address")

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

async def confirm_email(token: str, db: AsyncSession) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        email = payload["sub"]
        user = await get_user_by_email(db, email)
        user.is_verified = True
        await db.commit()
        await db.refresh(user)
        return user

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")

async def start_password_reset(email: str, db: AsyncSession):

    user = await get_user_by_email(db, email)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User with this email address does not exist")

    reset_password_token =  jwt.encode({
        "sub": email,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }, SECRET_KEY, algorithm="HS256")


    await send_password_reset_mail(email, reset_password_token)

async def reset_password(token: str, new_password: str, db: AsyncSession) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        email = payload["sub"]
        user = await get_user_by_email(db, email)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        user.hashed_password = bcrypt.hash(new_password)
        await db.commit()
        await db.refresh(user)

        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")

