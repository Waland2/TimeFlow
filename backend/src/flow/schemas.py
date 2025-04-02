from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from src.card.schemas import CardOut


class FlowStart(BaseModel):
    card_id: int

class FlowOut(BaseModel):
    start: datetime
    end: Optional[datetime] = None
    card: Optional[CardOut] = None

    class Config:
        orm_mode = True