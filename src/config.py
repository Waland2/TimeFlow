DEBUG = True

DATABASE_URL = "sqlite+aiosqlite:///./dev.db" # TODO: change to postgres or mysql

SECRET_KEY = "super-secret-key"
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