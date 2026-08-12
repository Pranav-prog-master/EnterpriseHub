from rest_framework import viewsets, permissions
from apps.core.permissions import IsCompanyMember
from .models import Lead, Customer, Deal
from .serializers import LeadSerializer, CustomerSerializer, DealSerializer


class LeadViewSet(viewsets.ModelViewSet):
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyMember]
    filterset_fields = ["status", "assigned_to"]
    search_fields = ["name", "email", "company_name"]
    queryset = Lead.objects.none()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Lead.objects.none()
        if hasattr(self.request.user, 'company') and self.request.user.company:
            company_id = str(self.request.user.company.id)
            return Lead.objects.filter(company_id=company_id)
        return Lead.objects.none()

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'company') and self.request.user.company:
            company_id = str(self.request.user.company.id)
        else:
            company_id = ""
        serializer.save(company_id=company_id, created_by_id=str(self.request.user.id))


class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyMember]
    queryset = Customer.objects.none()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Customer.objects.none()
        if hasattr(self.request.user, 'company') and self.request.user.company:
            company_id = str(self.request.user.company.id)
            return Customer.objects.filter(company_id=company_id)
        return Customer.objects.none()

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'company') and self.request.user.company:
            company_id = str(self.request.user.company.id)
        else:
            company_id = ""
        serializer.save(company_id=company_id, created_by_id=str(self.request.user.id))


class DealViewSet(viewsets.ModelViewSet):
    serializer_class = DealSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyMember]
    filterset_fields = ["status", "assigned_to"]
    queryset = Deal.objects.none()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Deal.objects.none()
        if hasattr(self.request.user, 'company') and self.request.user.company:
            company_id = str(self.request.user.company.id)
            return Deal.objects.filter(company_id=company_id)
        return Deal.objects.none()

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'company') and self.request.user.company:
            company_id = str(self.request.user.company.id)
        else:
            company_id = ""
        serializer.save(company_id=company_id, created_by_id=str(self.request.user.id))
