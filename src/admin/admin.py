from sqladmin import Admin
from src.admin.admin_auth import AdminAuth
from src.admin.admin_models import UserAdmin, CardAdmin, FlowAdmin
from src.config import SECRET_KEY
from src.database import engine

def init_admin(app):
    authentication_backend = AdminAuth(SECRET_KEY)
    admin = Admin(
        app=app,
        engine=engine,
        authentication_backend=authentication_backend
    )

    admin.add_view(UserAdmin)
    admin.add_view(CardAdmin)
    admin.add_view(FlowAdmin)

    return admin
