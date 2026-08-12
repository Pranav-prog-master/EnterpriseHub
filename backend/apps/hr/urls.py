from rest_framework.routers import DefaultRouter
from .views import (
    EmployeeViewSet, AttendanceViewSet, LeaveRequestViewSet,
    JobPostingViewSet, CandidateViewSet, PerformanceReviewViewSet,
)

router = DefaultRouter()
# Use proper prefixes - main urls.py already has "hr/" prefix
router.register(r'employees', EmployeeViewSet, basename="employee")
router.register(r'attendance', AttendanceViewSet, basename="attendance")
router.register(r'leave-requests', LeaveRequestViewSet, basename="leave-request")
router.register(r'jobs', JobPostingViewSet, basename="job")
router.register(r'candidates', CandidateViewSet, basename="candidate")
router.register(r'performance', PerformanceReviewViewSet, basename="performance")

urlpatterns = router.urls
