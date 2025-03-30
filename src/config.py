import os

DEBUG = os.getenv("DEBUG", "true").lower() == "true"
DEV = os.getenv("DEV", "true").lower() == "true"

DATABASE_URL = ""

if DEV:
    DATABASE_URL = "sqlite+aiosqlite:///./dev.db"
else:
    DATABASE_URL = os.getenv("DATABASE_URL")

SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300000

DEFAULT_CARDS = [
    {"name": "Study", "image": None},
    {"name": "Work", "image": None},
    {"name": "Rest", "image": None},
    {"name": "Exercise", "image": None},
    {"name": "Reading", "image": None},
    {"name": "Cooking", "image": None},
    {"name": "Music", "image": None},
    {"name": "Travel", "image": None},
    {"name": "Socializing", "image": None},
    {"name": "Sleep", "image": None},
]