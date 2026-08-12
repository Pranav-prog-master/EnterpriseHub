from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers
from drf_spectacular.utils import extend_schema, OpenApiResponse
from django.db.models import Count, Sum, Avg
from apps.hr.models import Employee, Attendance, LeaveRequest
from apps.projects.models import Project, Task
from apps.crm.models import Lead, Deal


# Serializers for OpenAPI documentation
class DashboardAnalyticsSerializer(serializers.Serializer):
    hr = serializers.DictField(child=serializers.IntegerField())
    projects = serializers.DictField(child=serializers.IntegerField())
    tasks = serializers.DictField(child=serializers.IntegerField())
    crm = serializers.DictField()


class HRAnalyticsSerializer(serializers.Serializer):
    department_breakdown = serializers.ListField(child=serializers.DictField())


class DashboardAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DashboardAnalyticsSerializer

    @extend_schema(
        responses={200: DashboardAnalyticsSerializer},
        description="Get dashboard analytics overview"
    )
    def get(self, request):
        # Get company_id from user - handle both cases
        try:
            if hasattr(request.user, 'company') and request.user.company:
                company_id = str(request.user.company.id)
            elif hasattr(request.user, 'company_id') and request.user.company_id:
                company_id = str(request.user.company_id)
            else:
                # Return empty data if no company
                return Response({
                    "hr": {"total_employees": 0, "on_leave": 0, "open_positions": 0},
                    "projects": {"total": 0, "active": 0, "completed": 0},
                    "tasks": {"total": 0, "done": 0, "overdue": 0},
                    "crm": {"leads": 0, "deals_open": 0, "revenue": 0},
                })
        except Exception as e:
            company_id = ""
        
        try:
            # Use company_id string field for MongoEngine models
            return Response({
                "hr": {
                    "total_employees": Employee.objects.filter(company_id=company_id).count(),
                    "on_leave": Employee.objects.filter(company_id=company_id, status="on_leave").count(),
                    "open_positions": 0,
                },
                "projects": {
                    "total": Project.objects.filter(company_id=company_id).count(),
                    "active": Project.objects.filter(company_id=company_id, status="active").count(),
                    "completed": Project.objects.filter(company_id=company_id, status="completed").count(),
                },
                "tasks": {
                    "total": Task.objects.filter(company_id=company_id).count(),
                    "done": Task.objects.filter(company_id=company_id, status="done").count(),
                    "overdue": 0,
                },
                "crm": {
                    "leads": Lead.objects.filter(company_id=company_id).count(),
                    "deals_open": Deal.objects.filter(company_id=company_id, status="open").count(),
                    "revenue": sum([d.value for d in Deal.objects.filter(company_id=company_id, status="won")]),
                },
            })
        except Exception as e:
            # Return empty data if there's an error
            return Response({
                "hr": {"total_employees": 0, "on_leave": 0, "open_positions": 0},
                "projects": {"total": 0, "active": 0, "completed": 0},
                "tasks": {"total": 0, "done": 0, "overdue": 0},
                "crm": {"leads": 0, "deals_open": 0, "revenue": 0},
                "error": str(e)
            })


class HRAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = HRAnalyticsSerializer

    @extend_schema(
        responses={200: HRAnalyticsSerializer},
        description="Get HR analytics with department breakdown"
    )
    def get(self, request):
        try:
            if hasattr(request.user, 'company') and request.user.company:
                company_id = str(request.user.company.id)
            elif hasattr(request.user, 'company_id') and request.user.company_id:
                company_id = str(request.user.company_id)
            else:
                return Response({"department_breakdown": []})
        except Exception:
            company_id = ""
        
        try:
            # Manual aggregation for MongoEngine
            employees = Employee.objects.filter(company_id=company_id)
            dept_breakdown = {}
            for emp in employees:
                dept = emp.department or "Unassigned"
                dept_breakdown[dept] = dept_breakdown.get(dept, 0) + 1
            
            breakdown_list = [{"department": k, "count": v} for k, v in dept_breakdown.items()]
            return Response({"department_breakdown": breakdown_list})
        except Exception as e:
            return Response({"department_breakdown": [], "error": str(e)})
