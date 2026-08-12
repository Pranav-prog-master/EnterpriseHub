from rest_framework import serializers
from .models import User, Company


class CompanySerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    domain = serializers.CharField()


class UserSerializer(serializers.Serializer):
    id = serializers.CharField()
    email = serializers.EmailField()
    username = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    role = serializers.CharField()
    avatar = serializers.CharField(allow_null=True)
    phone = serializers.CharField()
    department = serializers.CharField()
    job_title = serializers.CharField()
    is_online = serializers.BooleanField()
    is_active = serializers.BooleanField()
    date_joined = serializers.DateTimeField()
    company = serializers.SerializerMethodField()

    def get_company(self, obj):
        if obj.company:
            try:
                c = obj.company
                return {"id": str(c.id), "name": c.name, "domain": c.domain}
            except Exception:
                return None
        return None


class UserCreateSerializer(serializers.Serializer):
    # Allow more roles during registration
    ALLOWED_ROLES = [
        "company_admin",
        "hr", 
        "project_manager",
        "team_lead",
        "employee",
        "client"
    ]

    email      = serializers.EmailField()
    username   = serializers.CharField(min_length=3)
    first_name = serializers.CharField(default="", required=False, allow_blank=True)
    last_name  = serializers.CharField(default="", required=False, allow_blank=True)
    password   = serializers.CharField(write_only=True, min_length=8)
    role       = serializers.ChoiceField(choices=ALLOWED_ROLES, default="employee")
    phone      = serializers.CharField(default="", required=False, allow_blank=True)
    department = serializers.CharField(default="", required=False, allow_blank=True)
    job_title  = serializers.CharField(default="", required=False, allow_blank=True)

    def validate_email(self, value):
        if User.objects(email=value).first():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()  # Normalize email to lowercase

    def validate_username(self, value):
        if User.objects(username=value).first():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def create(self, validated_data):
        user = User(
            email=validated_data["email"],
            username=validated_data["username"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            role=validated_data.get("role", "employee"),
            phone=validated_data.get("phone", ""),
            department=validated_data.get("department", ""),
            job_title=validated_data.get("job_title", ""),
        )
        user.set_password(validated_data["password"])
        user.save()
        return user
