from pydantic import BaseModel

class CardCreate(BaseModel):
    name: str

class CardDelete(BaseModel):
    id: int

class CardOut(BaseModel):
    id: int
    name: str
    class Config:
        orm_mode = True
