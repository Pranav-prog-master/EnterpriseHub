from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, LogoutView, PasswordResetView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("register", RegisterView.as_view()),
    path("login/", LoginView.as_view(), name="login"),
    path("login", LoginView.as_view()),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("logout", LogoutView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/refresh", TokenRefreshView.as_view()),
    path("password-reset/", PasswordResetView.as_view(), name="password_reset"),
    path("password-reset", PasswordResetView.as_view()),
]
