from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.hash import bcrypt
from datetime import datetime, timedelta
from src.auth.models import User
from src.auth.schemas import UserCreate, UserLogin
import jwt

from src.card.models import Card
from src.config import ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, DEFAULT_CARDS

from datetime import datetime, timedelta
import random

# Default activity schedule to base daily flows on
DAILY_SCHEDULE = [
    ("Sleep", 0.0, 8.5),
    ("Commute", 8.5, 9.5),
    ("Study", 9.5, 12.0),
    ("Rest", 12.0, 13.0),
    ("Study", 13.0, 15.0),
    ("Commute", 15.0, 16.0),
    ("Study", 16.0, 17.5),
    ("Rest", 17.5, 20.0),
    ("Work", 20.0, 21.5),
    ("Sleep", 22.0, 24.0),
]

def generate_irregular_schedule() -> list[tuple[str, float, float]]:
    schedule = []
    offset = random.uniform(-0.5, 0.5)
    for activity, start, end in DAILY_SCHEDULE:
        delta = random.uniform(-0.4, 0.4)
        s = max(0.0, start + offset + random.uniform(-0.2, 0.2))
        e = min(max(s + 0.5, end + offset + delta), 24.0)
        schedule.append((activity, s, e))
    return schedule

async def create_user(db: AsyncSession, email: str, password: str, language: Optional[str] = None) -> User:
    user = User(
        email=email,
        hashed_password=bcrypt.hash(password),
        language=language
    )
    db.add(user)
    await db.flush()

    card_objs = {}
    for card_data in DEFAULT_CARDS:
        card = Card(**card_data, user_id=user.id)
        db.add(card)
        card_objs[card_data["name"]] = card

    await db.flush()

    base = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    for i in range(14):
        day = base + timedelta(days=i)
        for activity, start_h, end_h in generate_irregular_schedule():
            card = card_objs.get(activity)
            if not card:
                continue
            db.add(Flow(
                user_id=user.id,
                card_id=card.id,
                start=day + timedelta(hours=start_h),
                end=day + timedelta(hours=end_h)
            ))

    await db.commit()
    await db.refresh(user)
    return user

async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    print(email)
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

async def auth_user(db: AsyncSession, email: str, password: str) -> str | None:
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