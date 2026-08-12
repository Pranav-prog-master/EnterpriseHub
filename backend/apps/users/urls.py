from django.urls import path
from .views import UserListView, UserDetailView, UserCreateView

urlpatterns = [
    path("", UserListView.as_view()),
    path("me/", UserDetailView.as_view()),
    path("me", UserDetailView.as_view()),
    path("register/", UserCreateView.as_view()),
    path("register", UserCreateView.as_view()),
]
