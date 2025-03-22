from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.models import User
from src.card.models import Card
from src.card.schemas import CardCreate


async def create_card(card_name: str, db: AsyncSession, user: User) -> Card:
    card = Card(name = card_name, user_id = user.id)
    db.add(card)
    await db.commit()
    await db.refresh(card)
    return card

async def delete_card(card_name: str, db: AsyncSession, user: User) -> Card:
    result = await db.execute(select(Card).where(Card.user_id == user.id, Card.name == card_name))
    card = result.scalar()

    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")

    await db.delete(card)
    await db.commit()
    return card


async def get_cards(db: AsyncSession, user: User) -> list[Card]: # TODO: should return only unique
    result = await db.execute(select(Card).where(Card.user_id == user.id))
    cards = result.scalars().all()
    return list(cards)

