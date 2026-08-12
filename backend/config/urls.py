from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView


@csrf_exempt
def api_root(request):
    """Root API endpoint - provides API information"""
    return JsonResponse({
        "message": "EnterpriseHub AI API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "api": "/api/v1/",
            "admin": "/admin/" if settings.DEBUG else None,
            "docs": {
                "swagger": "/api/schema/swagger-ui/",
                "redoc": "/api/schema/redoc/",
                "schema": "/api/schema/"
            }
        },
        "modules": [
            "authentication",
            "users", 
            "hr",
            "projects",
            "crm",
            "documents",
            "collaboration",
            "notifications",
            "analytics",
            "finance",
            "calendar",
            "reports"
        ]
    })


api_v1 = [
    path("auth/",          include("apps.authentication.urls")),
    path("users/",         include("apps.users.urls")),
    path("hr/",            include("apps.hr.urls")),
    path("projects/",      include("apps.projects.urls")),
    path("crm/",           include("apps.crm.urls")),
    path("documents/",     include("apps.documents.urls")),
    path("collaboration/", include("apps.collaboration.urls")),
    path("notifications/", include("apps.notifications.urls")),
    path("analytics/",     include("apps.analytics.urls")),
    path("finance/",       include("apps.finance.urls")),
    path("calendar/",      include("apps.calendar.urls")),
    path("reports/",       include("apps.reports.urls")),
]

urlpatterns = [
    path("", api_root, name="api-root"),  # Root URL
    path("api/v1/", include(api_v1)),
    # API Schema & Documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/schema/swagger-ui/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/schema/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG and getattr(settings, "DEBUG_TOOLBAR_ENABLED", False):
    try:
        urlpatterns += [path("__debug__/", include("debug_toolbar.urls"))]
    except Exception:
        pass
