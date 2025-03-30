from datetime import datetime

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models import Base


class Flow(Base):
    __tablename__ = "flows"

    id: Mapped[int] = mapped_column(primary_key=True)
    start: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    end: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="flows")

    card_id: Mapped[int] = mapped_column(ForeignKey("cards.id"), nullable=True)
    card: Mapped["Card"] = relationship(back_populates="flows")

    def __str__(self):
        return f"{self.card}_{self.user}"

