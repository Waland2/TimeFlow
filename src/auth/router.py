from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.schemas import UserCreate, UserOut, UserLogin, Token, LanguageUpdate
import src.auth.service as service # import create_user, get_user_by_email, auth_user, change_language
from src.auth.dependencies import get_current_user
from src.database import get_db

auth_router = APIRouter()

@auth_router.post("/register", response_model=UserOut)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    existing_user = await service.get_user_by_email(db, str(user.email))
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    return await service.create_user(db, user)

@auth_router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    token = await service.auth_user(db, credentials)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    return {"access_token": token, "token_type": "bearer"}

@auth_router.get("/me", response_model=UserOut)
async def get_profile(current_user = Depends(get_current_user)):
    return current_user

@auth_router.post("/change_language", response_model=UserOut)
async def update_language(
    language_update: LanguageUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await service.change_language(new_language=language_update.new_language, db=db, user=current_user)