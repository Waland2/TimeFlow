import sys
import asyncio
from src.database import AsyncSessionLocal
from src.auth.service import create_user, get_user_by_email

async def create_admin(email: str, password: str):
    async with AsyncSessionLocal() as db:
        existing_user = await get_user_by_email(db, email)
        if existing_user:
            print(f"User with email {email} already exists.")
            return

        user = await create_user(db, email, password)
        user.is_admin = True
        await db.commit()
        await db.refresh(user)
        print(f"Admin {email} has been created successfully.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python create_admin.py <email> <password>")
        sys.exit(1)

    email = sys.argv[1]
    password = sys.argv[2]

    asyncio.run(create_admin(email, password))
