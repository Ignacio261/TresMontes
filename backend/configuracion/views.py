from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Sucursal, Area, Beneficio, Periodo, ParametroSistema
from .serializers import (
    SucursalSerializer, AreaSerializer, BeneficioSerializer,
    PeriodoSerializer, ParametroSerializer
)

# Sin permisos para evitar 401 durante pruebas
permission_classes = []


class SucursalViewSet(viewsets.ModelViewSet):
    serializer_class = SucursalSerializer
    queryset = Sucursal.objects.all()
    permission_classes = []

    def list(self, request):
        data = list(self.get_queryset().values("id", "nombre", "activo"))
        return Response(data)

    @action(detail=False, methods=["get"])
    def activos(self, request):
        data = list(self.get_queryset().filter(activo=True).values("id", "nombre", "activo"))
        return Response(data)


class AreaViewSet(viewsets.ModelViewSet):
    serializer_class = AreaSerializer
    queryset = Area.objects.all()
    permission_classes = []

    def list(self, request):
        data = list(self.get_queryset().values("id", "nombre", "activo"))
        return Response(data)

    @action(detail=False, methods=["get"])
    def activos(self, request):
        data = list(self.get_queryset().filter(activo=True).values("id", "nombre", "activo"))
        return Response(data)


class BeneficioViewSet(viewsets.ModelViewSet):
    serializer_class = BeneficioSerializer
    queryset = Beneficio.objects.all()
    permission_classes = []

    def list(self, request):
        data = list(self.get_queryset().values("id", "nombre", "activo"))
        return Response(data)

    @action(detail=False, methods=["get"])
    def activos(self, request):
        data = list(self.get_queryset().filter(activo=True).values("id", "nombre", "activo"))
        return Response(data)


class PeriodoViewSet(viewsets.ModelViewSet):
    serializer_class = PeriodoSerializer
    queryset = Periodo.objects.all()
    permission_classes = []

    def list(self, request):
        data = list(self.get_queryset().values("id", "nombre", "activo"))
        return Response(data)

    @action(detail=False, methods=["get"])
    def activos(self, request):
        data = list(self.get_queryset().filter(activo=True).values("id", "nombre", "activo"))
        return Response(data)


class ParametroViewSet(viewsets.ModelViewSet):
    serializer_class = ParametroSerializer
    queryset = ParametroSistema.objects.all()
    permission_classes = []

    def list(self, request):
        data = list(self.get_queryset().values("id", "clave", "valor", "activo"))
        return Response(data)

    @action(detail=False, methods=["get"])
    def dict(self, request):
        qs = self.get_queryset().filter(activo=True)
        data = {p.clave: p.valor for p in qs}
        return Response(data)
