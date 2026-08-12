from django.urls import path
from .views import DashboardAnalyticsView, HRAnalyticsView

urlpatterns = [
    path("dashboard/", DashboardAnalyticsView.as_view()),
    path("dashboard", DashboardAnalyticsView.as_view()),
    path("hr/", HRAnalyticsView.as_view()),
    path("hr", HRAnalyticsView.as_view()),
]
