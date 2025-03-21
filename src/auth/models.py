from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String

from src.models import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(40), nullable=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=True)
    language: Mapped[str] = mapped_column(String(3), unique=True, default="eng")
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)

