from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    role = serializers.ChoiceField(
        choices=["super_admin", "company_admin", "hr", "project_manager", "team_lead", "employee", "client", "guest"],
        required=False,
        allow_null=True,
    )


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField(min_length=8)
