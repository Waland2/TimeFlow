from fastapi import FastAPI

from src.config import DEBUG, DEV
from src.router import main_router
from src.models import Base
from src.database import engine


app = FastAPI(debug=DEBUG)
app.include_router(main_router)



@app.on_event("startup")
async def startup():
    if DEV:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)