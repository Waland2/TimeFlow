from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.auth.models import User
from src.card.models import Card
from src.card.schemas import CardCreate
from src.flow.models import Flow


# TODO replace user: User to user_id: int

async def create_card(card_name: str, db: AsyncSession, user: User) -> Optional[Card]: # TODO: if card with this name alreay exist in users card - return error
    if card_name.lower() == 'void': return None
    card = Card(name = card_name, user_id = user.id)
    db.add(card)
    await db.commit()
    await db.refresh(card)
    return card

async def delete_card(card_id: int, db: AsyncSession, user: User) -> Card:
    result = await db.execute(select(Card).where(Card.user_id == user.id, Card.id == card_id))
    card = result.scalar()

    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")

    card.is_active = False
    await db.commit()
    await db.refresh(card)
    return card

async def edit_card(card_id: int, name: Optional[str], db: AsyncSession, user: User) -> Card:
    result = await db.execute(select(Card).where(Card.user_id == user.id, Card.id == card_id))
    card = result.scalar()

    if name:
        card.name = name
        await db.commit()
        await db.refresh(card)

    return card


async def get_cards(db: AsyncSession, user: User) -> list[Card]: # TODO: should return only unique
    result = await db.execute(select(Card).where(Card.user_id == user.id, Card.is_active == True))
    cards = result.scalars().all()
    return list(cards)


async def get_active_card(db: AsyncSession, user: User):
    result = await db.execute(
        select(Flow)
        .where(Flow.user_id == user.id, Flow.end.is_(None))
        .options(selectinload(Flow.card))
    )
    active_flow = result.scalar_one_or_none()
    if active_flow:
        return active_flow.card
    return None