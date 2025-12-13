from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet

router = DefaultRouter()
router.register(r'', UsuarioViewSet, basename='usuario')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', UsuarioViewSet.as_view({'post': 'login'}), name='login'),
    path('me/', UsuarioViewSet.as_view({'get': 'me'}), name='me'),
    path('registro/', UsuarioViewSet.as_view({'post': 'registro'}), name='registro'),
    path('logout/', UsuarioViewSet.as_view({'post': 'logout'}), name='logout'),
    path('cambiar-password/', UsuarioViewSet.as_view({'post': 'cambiar_password'}), name='cambiar_password'),
    path('perfil/', UsuarioViewSet.as_view({'put': 'perfil'}), name='perfil'),
]