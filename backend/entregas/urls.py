from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EntregaViewSet, entrega_masiva, entrega_por_grupo

router = DefaultRouter()
router.register('crud', EntregaViewSet, basename='entregas')

urlpatterns = [
    path('', include(router.urls)),
    path('masiva/', entrega_masiva),
    path('grupo/', entrega_por_grupo),
]
