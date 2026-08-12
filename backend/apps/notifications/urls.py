from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import NotificationViewSet

router = DefaultRouter()
# Empty prefix because "notifications/" is already in main urls.py
router.register(r'', NotificationViewSet, basename="notification")

urlpatterns = router.urls
