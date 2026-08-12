from rest_framework import viewsets, permissions, decorators, response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Employee, Attendance, LeaveRequest, LeaveType, JobPosting, Candidate, PerformanceReview
from .serializers import (
    EmployeeSerializer, AttendanceSerializer, LeaveRequestSerializer,
    LeaveTypeSerializer, JobPostingSerializer, CandidateSerializer, PerformanceReviewSerializer,
)
from apps.core.permissions import IsHR, IsCompanyMember, CanViewOwnDataOnly


class EmployeeViewSet(viewsets.ModelViewSet):
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyMember]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["department", "status"]
    search_fields = ["user__first_name", "user__last_name", "employee_id"]
    queryset = Employee.objects.none()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Employee.objects.none()
        if hasattr(self.request.user, 'company') and self.request.user.company:
            company_id = str(self.request.user.company.id)
            return Employee.objects.filter(company_id=company_id)
        return Employee.objects.none()


class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyMember]
    filterset_fields = ["employee", "date", "status"]
    queryset = Attendance.objects.none()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Attendance.objects.none()
        if hasattr(self.request.user, 'company') and self.request.user.company:
            company_id = str(self.request.user.company.id)
            return Attendance.objects.filter(company_id=company_id)
        return Attendance.objects.none()


class LeaveRequestViewSet(viewsets.ModelViewSet):
    serializer_class = LeaveRequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyMember]
    queryset = LeaveRequest.objects.none()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return LeaveRequest.objects.none()
        
        if not hasattr(self.request.user, 'company') or not self.request.user.company:
            return LeaveRequest.objects.none()
        
        company_id = str(self.request.user.company.id)
        qs = LeaveRequest.objects.filter(company_id=company_id)
        
        # Regular employees can only see their own leave requests
        if self.request.user.role == "employee":
            user_id = str(self.request.user.id)
            qs = qs.filter(employee__user_id=user_id)
        
        return qs

    @decorators.action(detail=True, methods=["post"], permission_classes=[IsHR])
    def approve(self, request, pk=None):
        leave = self.get_object()
        leave.status = "approved"
        leave.approved_by_id = str(request.user.id)
        leave.save()
        return response.Response({"status": "approved"})

    @decorators.action(detail=True, methods=["post"], permission_classes=[IsHR])
    def reject(self, request, pk=None):
        leave = self.get_object()
        leave.status = "rejected"
        leave.approved_by_id = str(request.user.id)
        leave.save()
        return response.Response({"status": "rejected"})


class JobPostingViewSet(viewsets.ModelViewSet):
    serializer_class = JobPostingSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyMember]
    queryset = JobPosting.objects.none()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return JobPosting.objects.none()
        if hasattr(self.request.user, 'company') and self.request.user.company:
            company_id = str(self.request.user.company.id)
            return JobPosting.objects.filter(company_id=company_id)
        return JobPosting.objects.none()


class CandidateViewSet(viewsets.ModelViewSet):
    serializer_class = CandidateSerializer
    permission_classes = [IsHR, IsCompanyMember]
    queryset = Candidate.objects.none()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Candidate.objects.none()
        if hasattr(self.request.user, 'company') and self.request.user.company:
            company_id = str(self.request.user.company.id)
            return Candidate.objects.filter(company_id=company_id)
        return Candidate.objects.none()

    @decorators.action(detail=True, methods=["post"])
    def ai_screen(self, request, pk=None):
        return response.Response({"detail": "AI screening not available."})


class PerformanceReviewViewSet(viewsets.ModelViewSet):
    serializer_class = PerformanceReviewSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyMember]
    queryset = PerformanceReview.objects.none()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return PerformanceReview.objects.none()
        if hasattr(self.request.user, 'company') and self.request.user.company:
            company_id = str(self.request.user.company.id)
            return PerformanceReview.objects.filter(company_id=company_id)
        return PerformanceReview.objects.none()
