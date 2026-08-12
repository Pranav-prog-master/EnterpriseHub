from rest_framework import viewsets, permissions, decorators, response
from apps.core.permissions import IsCompanyMember
from .models import Project, Sprint, Task, Comment, TimeLog, Milestone
from .serializers import (
    ProjectSerializer, SprintSerializer, TaskSerializer,
    CommentSerializer, TimeLogSerializer, MilestoneSerializer,
)


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyMember]
    queryset = Project.objects.none()  # Default for schema generation

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Project.objects.none()
        # Use company_id string field for MongoEngine - handle None case
        if hasattr(self.request.user, 'company') and self.request.user.company:
            company_id = str(self.request.user.company.id)
        else:
            company_id = ""
        return Project.objects.filter(company_id=company_id) if company_id else Project.objects.none()

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'company') and self.request.user.company:
            company_id = str(self.request.user.company.id)
        else:
            company_id = ""
        serializer.save(
            owner_id=str(self.request.user.id), 
            company_id=company_id,
            created_by_id=str(self.request.user.id)
        )

    @decorators.action(detail=True, methods=["post"])
    def analyze_risk(self, request, pk=None):
        return response.Response({"detail": "Risk analysis not available."})


class SprintViewSet(viewsets.ModelViewSet):
    serializer_class = SprintSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyMember]
    queryset = Sprint.objects.none()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Sprint.objects.none()
        if hasattr(self.request.user, 'company') and self.request.user.company:
            company_id = str(self.request.user.company.id)
        else:
            company_id = ""
        return Sprint.objects.filter(company_id=company_id) if company_id else Sprint.objects.none()


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyMember]
    filterset_fields = ["status", "priority", "task_type"]
    search_fields = ["title", "description"]
    queryset = Task.objects.none()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Task.objects.none()
        if hasattr(self.request.user, 'company') and self.request.user.company:
            company_id = str(self.request.user.company.id)
        else:
            company_id = ""
        return Task.objects.filter(company_id=company_id) if company_id else Task.objects.none()

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'company') and self.request.user.company:
            company_id = str(self.request.user.company.id)
        else:
            company_id = ""
        serializer.save(
            reporter_id=str(self.request.user.id),
            company_id=company_id,
            created_by_id=str(self.request.user.id)
        )


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyMember]
    queryset = Comment.objects.none()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Comment.objects.none()
        company_id = str(self.request.user.company.id) if hasattr(self.request.user, 'company') and self.request.user.company else ""
        return Comment.objects.filter(company_id=company_id) if company_id else Comment.objects.none()

    def perform_create(self, serializer):
        company_id = str(self.request.user.company.id) if hasattr(self.request.user, 'company') and self.request.user.company else ""
        serializer.save(
            author_id=str(self.request.user.id),
            company_id=company_id,
            created_by_id=str(self.request.user.id)
        )


class TimeLogViewSet(viewsets.ModelViewSet):
    serializer_class = TimeLogSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyMember]
    queryset = TimeLog.objects.none()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return TimeLog.objects.none()
        company_id = str(self.request.user.company.id) if hasattr(self.request.user, 'company') and self.request.user.company else ""
        return TimeLog.objects.filter(company_id=company_id) if company_id else TimeLog.objects.none()

    def perform_create(self, serializer):
        company_id = str(self.request.user.company.id) if hasattr(self.request.user, 'company') and self.request.user.company else ""
        serializer.save(
            user_id=str(self.request.user.id),
            company_id=company_id,
            created_by_id=str(self.request.user.id)
        )


class MilestoneViewSet(viewsets.ModelViewSet):
    serializer_class = MilestoneSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyMember]
    queryset = Milestone.objects.none()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Milestone.objects.none()
        company_id = str(self.request.user.company.id) if hasattr(self.request.user, 'company') and self.request.user.company else ""
        return Milestone.objects.filter(company_id=company_id) if company_id else Milestone.objects.none()
