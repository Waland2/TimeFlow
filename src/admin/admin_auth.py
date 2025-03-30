from fastapi import Request
from sqladmin.authentication import AuthenticationBackend
from src.auth.service import get_user_by_email
from src.database import AsyncSessionLocal
from passlib.hash import bcrypt

class AdminAuth(AuthenticationBackend):
    def __init__(self, secret_key: str):
        super().__init__(secret_key=secret_key)

    async def login(self, request: Request) -> bool:
        form = await request.form()
        email = form.get("username")
        password = form.get("password")

        async with AsyncSessionLocal() as db:
            user = await get_user_by_email(db, email)

        if not user or not user.is_admin:
            return False

        if not bcrypt.verify(password, user.hashed_password):
            return False

        request.session.update({"logged_in": True, "admin_user": str(user.id)})
        return True

    async def logout(self, request: Request) -> None:
        request.session.clear()

    async def authenticate(self, request: Request) -> bool:
        return request.session.get("logged_in", False)
