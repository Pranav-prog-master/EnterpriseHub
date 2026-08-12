import os
from pathlib import Path
import environ
import mongoengine

BASE_DIR = Path(__file__).resolve().parent.parent.parent
env = environ.Env()
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("SECRET_KEY")
DEBUG = env.bool("DEBUG", default=False)
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["localhost"])

DJANGO_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "django_filters",
    "drf_spectacular",
    "channels",
    "storages",
]

LOCAL_APPS = [
    "apps.core",
    "apps.authentication",
    "apps.users",
    "apps.hr",
    "apps.projects",
    "apps.crm",
    "apps.documents",
    "apps.collaboration",
    "apps.notifications",
    "apps.analytics",
    "apps.finance",
    "apps.calendar",
    "apps.reports",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    # CSRF disabled for API-only backend with JWT authentication
    # "django.middleware.csrf.CsrfViewMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": not DEBUG,  # Only use APP_DIRS when not using custom loaders
        "OPTIONS": {
            "context_processors": [],
            # Enable template caching for better performance (only in production)
            "loaders": [
                (
                    "django.template.loaders.cached.Loader",
                    [
                        "django.template.loaders.filesystem.Loader",
                        "django.template.loaders.app_directories.Loader",
                    ],
                ),
            ] if not DEBUG else None,
        },
    },
]

# Full MongoDB — no SQL database at all
MONGODB_URI = env("MONGODB_URI", default="mongodb://localhost:27017/enterprisehub")

# MongoDB Connection Pooling for better performance
import mongoengine
mongoengine.connect(
    host=MONGODB_URI,
    maxPoolSize=50,  # Max 50 connections
    minPoolSize=10,  # Keep at least 10 connections open
    maxIdleTimeMS=30000,  # Close idle connections after 30 seconds
    serverSelectionTimeoutMS=3000,  # Timeout after 3 seconds
    socketTimeoutMS=20000,  # Socket timeout 20 seconds
    connectTimeoutMS=10000,  # Connect timeout 10 seconds
    retryWrites=True,  # Retry failed writes
)

# Dummy DB backend — satisfies SimpleJWT/DRF imports, never actually used
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.dummy",
    }
}

# Disable ALL migrations — no SQL tables ever created
MIGRATION_MODULES = {
    "auth": None,
    "contenttypes": None,
    "admin": None,
    "sessions": None,
}

REDIS_URL = env("REDIS_URL", default="redis://localhost:6379/0")

if env.bool("CELERY_TASK_ALWAYS_EAGER", default=False):
    CHANNEL_LAYERS = {"default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}}
    CACHES = {"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}}
else:
    # Redis with connection pooling for better performance
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {
                "hosts": [REDIS_URL],
                "capacity": 1500,
                "expiry": 10,
            },
        }
    }
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.redis.RedisCache",
            "LOCATION": REDIS_URL,
            "OPTIONS": {
                "CLIENT_CLASS": "django_redis.client.DefaultClient",
                "CONNECTION_POOL_KWARGS": {
                    "max_connections": 50,
                    "retry_on_timeout": True,
                },
                "SOCKET_CONNECT_TIMEOUT": 5,
                "SOCKET_TIMEOUT": 5,
            },
            "KEY_PREFIX": "enterprisehub",
            "TIMEOUT": 300,  # 5 minutes
        }
    }

CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = REDIS_URL
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_TASK_ALWAYS_EAGER = env.bool("CELERY_TASK_ALWAYS_EAGER", default=False)

# Performance optimization
CONN_MAX_AGE = 60  # Keep database connections alive for 60 seconds

AUTHENTICATION_BACKENDS = ["apps.users.backends.MongoAuthBackend"]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "apps.authentication.jwt_auth.MongoJWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_PAGINATION_CLASS": "apps.core.pagination.StandardPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "EXCEPTION_HANDLER": "rest_framework.views.exception_handler",
    # Performance optimizations
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
    ],
    # Response compression
    "NUM_PROXIES": 1,
    # Throttling for better performance
    "DEFAULT_THROTTLE_CLASSES": [],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "100/hour",
        "user": "1000/hour",
    },
}

from datetime import timedelta
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=env.int("JWT_ACCESS_TOKEN_LIFETIME", 15)),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=env.int("JWT_REFRESH_TOKEN_LIFETIME", 7)),
    "ROTATE_REFRESH_TOKENS": True,
}

SPECTACULAR_SETTINGS = {
    "TITLE": "EnterpriseHub AI API",
    "DESCRIPTION": "Enterprise-grade SaaS platform API",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "SCHEMA_COERCE_PATH_PK_SUFFIX": True,
    "COMPONENT_SPLIT_REQUEST": True,
    # Suppress errors from mongoengine models that drf_spectacular can't introspect
    "POSTPROCESSING_HOOKS": [],
    # Disable schema generation warnings for custom authentication
    "AUTHENTICATION_WHITELIST": [],
    # Skip views that cause issues with schema generation
    "SERVE_PERMISSIONS": ["rest_framework.permissions.AllowAny"],
    # Disable automatic error checking for MongoEngine models
    "PREPROCESSING_HOOKS": [],
    "SWAGGER_UI_SETTINGS": {
        "deepLinking": True,
        "persistAuthorization": True,
        "displayOperationId": True,
    },
    # Ignore MongoEngine specific errors
    "ENUM_NAME_OVERRIDES": {},
    "APPEND_COMPONENTS": {},
}

# CSRF Settings for API
CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS", default=["http://localhost:3000"])
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SECURE = env.bool("CSRF_COOKIE_SECURE", default=False)  # True in production

CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=["http://localhost:3000"])

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
APPEND_SLASH = False

# Logging configuration optimized for performance
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "simple": {
            "format": "{levelname} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "simple",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "WARNING",  # Only log warnings and errors
        },
        "django.server": {
            "handlers": ["console"],
            "level": "WARNING",
            "propagate": False,
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "WARNING",
    },
}


# Storage
USE_S3 = env.bool("USE_S3", default=False)
if USE_S3:
    AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = env("AWS_SECRET_ACCESS_KEY")
    AWS_STORAGE_BUCKET_NAME = env("AWS_STORAGE_BUCKET_NAME")
    AWS_S3_REGION_NAME = env("AWS_S3_REGION_NAME", default="us-east-1")
    AWS_DEFAULT_ACL = "private"
    DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"

# Email
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = env("EMAIL_HOST", default="smtp.gmail.com")
EMAIL_PORT = env.int("EMAIL_PORT", default=587)
EMAIL_USE_TLS = True
EMAIL_HOST_USER = env("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD", default="")

