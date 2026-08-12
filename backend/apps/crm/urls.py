from rest_framework.routers import DefaultRouter
from .views import LeadViewSet, CustomerViewSet, DealViewSet

router = DefaultRouter()
router.register("leads", LeadViewSet, basename="lead")
router.register("customers", CustomerViewSet, basename="customer")
router.register("deals", DealViewSet, basename="deal")

urlpatterns = router.urls
