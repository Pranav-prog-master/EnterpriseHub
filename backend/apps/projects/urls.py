from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ProjectViewSet, SprintViewSet, TaskViewSet, CommentViewSet, TimeLogViewSet, MilestoneViewSet

router = DefaultRouter()
# Empty prefix because "projects/" is already in main urls.py
router.register(r'', ProjectViewSet, basename="project")
router.register(r'sprints', SprintViewSet, basename="sprint")
router.register(r'tasks', TaskViewSet, basename="task")
router.register(r'comments', CommentViewSet, basename="comment")
router.register(r'time-logs', TimeLogViewSet, basename="timelog")
router.register(r'milestones', MilestoneViewSet, basename="milestone")

urlpatterns = router.urls
