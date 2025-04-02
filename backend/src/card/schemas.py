from typing import Optional

from pydantic import BaseModel

class CardCreate(BaseModel):
    name: str

class CardDelete(BaseModel):
    id: int

class CardEdit(BaseModel):
    id: int
    name: Optional[str] = None

class CardOut(BaseModel):
    id: int
    name: str
    class Config:
        orm_mode = True
