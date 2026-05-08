from django.urls import path
from .auth_views import admin_login_view, admin_logout_view, admin_me_view

urlpatterns = [
    path("login/", admin_login_view, name="admin-login"),
    path("logout/", admin_logout_view, name="admin-logout"),
    path("me/", admin_me_view, name="admin-me"),
]