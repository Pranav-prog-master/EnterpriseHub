from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from apps.users.models import User
from apps.users.serializers import UserSerializer, UserCreateSerializer
from .serializers import LoginSerializer, PasswordResetSerializer
from celery_tasks.email_tasks import send_login_notification, send_password_reset_email


def _jwt_response(user):
    refresh = RefreshToken()
    refresh["user_id"] = str(user.id)
    refresh["email"] = user.email
    refresh["role"] = user.role
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": UserSerializer(user).data,
    }


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserCreateSerializer

    @extend_schema(
        request=UserCreateSerializer,
        responses={201: UserSerializer},
        description="Register a new user account"
    )
    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = serializer.save()
            return Response(
                {
                    "message": "Account created successfully. Please log in.",
                    "user": UserSerializer(user).data,
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    @extend_schema(
        request=LoginSerializer,
        responses={200: UserSerializer},
        description="User login with email and password"
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email    = serializer.validated_data["email"]
        password = serializer.validated_data["password"]
        requested_role = serializer.validated_data.get("role")  # Optional role from frontend

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "No account found with this email."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.check_password(password):
            return Response(
                {"detail": "Incorrect password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:
            return Response(
                {"detail": "Account is disabled."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Optional: Verify role if provided (for stricter role-based access)
        if requested_role and user.role != requested_role:
            return Response(
                {"detail": f"This account does not have {requested_role} access."},
                status=status.HTTP_403_FORBIDDEN,
            )

        send_login_notification.delay(user.email, user.first_name or "there")
        return Response(_jwt_response(user))


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request={"refresh": OpenApiTypes.STR},
        responses={200: {"detail": OpenApiTypes.STR}},
        description="User logout - blacklist refresh token"
    )
    def post(self, request):
        try:
            token = RefreshToken(request.data.get("refresh", ""))
            token.blacklist()
        except Exception:
            pass
        return Response({"detail": "Logged out."})


class PasswordResetView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PasswordResetSerializer

    @extend_schema(
        request=PasswordResetSerializer,
        responses={200: {"detail": OpenApiTypes.STR}},
        description="Request password reset email"
    )
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        try:
            user = User.objects.get(email=email)
            reset_link = f"http://localhost:3000/reset-password?email={email}"
            send_password_reset_email.delay(user.email, reset_link)
        except User.DoesNotExist:
            pass
        return Response({"detail": "If that email exists, a reset link has been sent."})
