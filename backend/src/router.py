from fastapi import APIRouter
from src.auth.router import auth_router
from src.card.router import card_router
from src.flow.router import flow_router

api_v1_router = APIRouter()
api_v1_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_v1_router.include_router(card_router, prefix="/card", tags=["Card"])
api_v1_router.include_router(flow_router, prefix="/flow", tags=["Flow"])

main_router = APIRouter()
main_router.include_router(api_v1_router, prefix="/api/v1", tags=["API_v1"])