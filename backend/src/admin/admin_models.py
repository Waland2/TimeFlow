from sqladmin import ModelView

from src.auth.models import User
from src.card.models import Card
from src.flow.models import Flow


class UserAdmin(ModelView, model=User):
    column_list = [User.id, User.username, User.email, User.language, User.is_verified, User.is_admin]
    name = "User"
    name_plural = "Users"

class CardAdmin(ModelView, model=Card):
    column_list = "__all__"
    name = "Card"
    name_plural = "Cards"

class FlowAdmin(ModelView, model=Flow):
    column_list = "__all__"
    name = "Flow"
    name_plural = "Flows"