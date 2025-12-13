from rest_framework.routers import DefaultRouter
from .views import (
    SucursalViewSet, AreaViewSet, BeneficioViewSet,
    PeriodoViewSet, ParametroViewSet
)

router = DefaultRouter()
router.register(r'sucursales', SucursalViewSet, basename='sucursales')
router.register(r'areas', AreaViewSet, basename='areas')
router.register(r'beneficios', BeneficioViewSet, basename='beneficios')
router.register(r'periodos', PeriodoViewSet, basename='periodos')
router.register(r'parametros', ParametroViewSet, basename='parametros')

urlpatterns = router.urls
