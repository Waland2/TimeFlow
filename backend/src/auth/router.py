import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.schemas import UserCreate, UserOut, UserLogin, Token, LanguageUpdate, PasswordReset, EmailConfirmation, \
    PasswordResetRequest
import src.auth.service as service
from src.auth.dependencies import get_current_user
from src.config import SECRET_KEY
from src.database import get_db

auth_router = APIRouter()

@auth_router.post("/register", response_model=UserOut)
async def register(user_info: UserCreate, db: AsyncSession = Depends(get_db)):
    if len(user_info.password) <= 5:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password must be at least 6 characters long.")

    existing_user = await service.get_user_by_email(db, str(user_info.email))
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    return await service.create_user(db, user_info.email, user_info.password, user_info.language)

@auth_router.post("/login", response_model=Token)
async def login(user_info: UserLogin, db: AsyncSession = Depends(get_db)):
    token = await service.auth_user(db, user_info.email, user_info.password)
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


@auth_router.post("/confirm-email", response_model=UserOut)
async def confirm_email(data: EmailConfirmation, db: AsyncSession = Depends(get_db)):
    return await service.confirm_email(data.token, db)

@auth_router.post("/start-password-reset")
async def confirm_email(data: PasswordResetRequest, db: AsyncSession = Depends(get_db)):
    await service.start_password_reset(data.email, db)
    return {"status" : "ok"}

@auth_router.post("/password-reset", response_model=UserOut)
async def confirm_email(data: PasswordReset, db: AsyncSession = Depends(get_db)):
    return await service.reset_password(data.token, data.new_password, db)