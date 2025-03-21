from fastapi import FastAPI
from src.router import api_v1_router

from src.models import Base
from src.database import engine

app = FastAPI()
app.include_router(api_v1_router)

@app.on_event("startup")
async def startup(): # TODO: wtf is this?
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)