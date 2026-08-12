from rest_framework import serializers
from .models import Lead, Customer, Deal


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = "__all__"
        read_only_fields = ["ai_score"]


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"


class DealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deal
        fields = "__all__"
