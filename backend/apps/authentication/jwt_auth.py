from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from apps.users.models import User


class MongoJWTAuthentication(BaseAuthentication):
    """
    Stateless JWT authentication backed by MongoDB.
    Does not use Django ORM or token blacklist.
    """

    def authenticate(self, request):
        header = request.META.get("HTTP_AUTHORIZATION", "")
        if not header.startswith("Bearer "):
            return None

        raw_token = header.split(" ", 1)[1].strip()
        if not raw_token:
            return None

        try:
            validated = UntypedToken(raw_token)
        except (InvalidToken, TokenError) as e:
            raise AuthenticationFailed(str(e))

        user_id = validated.get("user_id")
        if not user_id:
            raise AuthenticationFailed("Token missing user_id")

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise AuthenticationFailed("User not found")

        if not user.is_active:
            raise AuthenticationFailed("User is inactive")

        return (user, validated)

    def authenticate_header(self, request):
        return "Bearer"
