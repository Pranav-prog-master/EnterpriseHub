from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
import logging
from .models import User
from .serializers import UserSerializer, UserCreateSerializer
from celery_tasks.email_tasks import send_welcome_email

logger = logging.getLogger(__name__)


def _safe_send(task_fn, *args):
    try:
        task_fn.delay(*args)
    except Exception as exc:
        logger.warning("Email task failed silently: %s", exc)


def _jwt_response(user):
    refresh = RefreshToken()
    refresh["user_id"] = str(user.id)
    refresh["email"]   = user.email
    refresh["role"]    = user.role
    return {
        "access":  str(refresh.access_token),
        "refresh": str(refresh),
        "user":    UserSerializer(user).data,
    }


class UserListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        users = User.objects(is_active=True)
        return Response(UserSerializer(users, many=True).data)


class UserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        user    = request.user
        allowed = ["first_name", "last_name", "phone", "department", "job_title", "avatar"]
        for field in allowed:
            if field in request.data:
                setattr(user, field, request.data[field])
        user.save()
        return Response(UserSerializer(user).data)


class UserCreateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        _safe_send(send_welcome_email, user.email, user.first_name or user.username, user.role)
        return Response(_jwt_response(user), status=status.HTTP_201_CREATED)
