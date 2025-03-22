from pydantic import BaseModel

class CardCreate(BaseModel):
    name: str

class CardOut(BaseModel):
    name: str
    class Config:
        orm_mode = True
