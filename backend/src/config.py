import os
from dotenv import load_dotenv

if not os.getenv("DEBUG"):
    load_dotenv("../.env.dev")

FRONT_DOMAIN = "timeflow.space"
DEBUG = os.getenv("DEBUG").lower() == "true"
DEV = os.getenv("DEV").lower() == "true"

DATABASE_URL = os.getenv("DATABASE_URL")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300000

DEFAULT_CARDS = [
    {"name": "Study", "image": None},
    {"name": "Work", "image": None},
    {"name": "Rest", "image": None},
    {"name": "Exercise", "image": None},
    {"name": "Socializing", "image": None},
    {"name": "Sleep", "image": None},
    {"name": "Commute", "image": None}
]


EMAILS_ENABLED = os.getenv("EMAILS_ENABLED").lower() == "true"
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
