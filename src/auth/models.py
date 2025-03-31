from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, text, Boolean

from src.card.models import Card
from src.flow.models import Flow
from src.models import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(40), nullable=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=True)
    language: Mapped[str] = mapped_column(String(3), default="eng")
    hashed_password: Mapped[str] = mapped_column(nullable=False)

    cards: Mapped[list[Card]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )
    flows: Mapped[list[Flow]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )

    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)


    def __str__(self):
        return self.email
