# src/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.admin.admin import init_admin
from src.config import DEBUG, DEV
from src.router import main_router
from src.models import Base
from src.database import engine



app = FastAPI(debug=DEBUG)
app.include_router(main_router)

init_admin(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    if DEV:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
