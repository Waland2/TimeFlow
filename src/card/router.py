from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import get_current_user
from src.auth.models import User
import src.card.service as service
from src.card.schemas import CardCreate, CardOut
from src.database import get_db

card_router = APIRouter()

@card_router.post("/create", response_model=CardCreate)
async def create_card(card_info: CardCreate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    return await service.create_card(card_info.name, db, user)


@card_router.post("/delete", response_model=CardCreate)
async def delete_card(card_info: CardCreate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    return await service.delete_card(card_info.name, db, user)


@card_router.get("/get", response_model=list[CardOut])
async def get_cards(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    return await service.get_cards(db, user)