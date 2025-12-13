# backend/core/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # JWT
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # API modules
    path("api/trabajadores/", include("trabajadores.urls")),
    path("api/qr/", include("qr_system.urls")),
    path("api/entregas/", include("entregas.urls")),
    path("api/notificaciones/", include("notificaciones.urls")),
    path("api/configuracion/", include("configuracion.urls")),
    path("api/reportes/", include("reportes.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
