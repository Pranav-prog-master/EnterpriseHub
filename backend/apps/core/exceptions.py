from rest_framework.exceptions import APIException
from rest_framework import status


class ServiceUnavailable(APIException):
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    default_detail = "Service temporarily unavailable."


class AIServiceError(APIException):
    status_code = status.HTTP_502_BAD_GATEWAY
    default_detail = "AI service error."


class StorageError(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "File storage error."
