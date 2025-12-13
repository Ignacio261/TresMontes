from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone

from .models import Entrega
from .serializers import (
    EntregaSerializer,
    EntregaDetalleSerializer,
    EntregaCreateSerializer,
)
from trabajadores.models import Trabajador


class EntregaViewSet(viewsets.ModelViewSet):
    queryset = Entrega.objects.all().select_related("trabajador")
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ["create"]:
            return EntregaCreateSerializer
        return EntregaSerializer

    # ---------------------------
    #  DETALLE
    # ---------------------------
    @action(detail=True, methods=["get"])
    def detalle(self, request, pk=None):
        entrega = self.get_object()
        ser = EntregaDetalleSerializer(entrega)
        return Response(ser.data)

    # ---------------------------
    #  CAMBIAR ESTADO
    # ---------------------------
    @action(detail=True, methods=["post"], url_path="cambiar-estado")
    def cambiar_estado(self, request, pk=None):
        entrega = self.get_object()
        nuevo = request.data.get("estado")

        if not nuevo:
            return Response({"error": "Debe enviar 'estado'"}, status=400)

        entrega.estado = nuevo
        entrega.fecha_retiro = timezone.now() if nuevo == "retirado" else None
        entrega.save()

        return Response({"msg": f"Estado cambiado a {nuevo}"})


# ---------------------------------------------------------
#  ENTREGA MASIVA GENERAL
# ---------------------------------------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def entrega_masiva(request):
    sucursal = request.data.get("sucursal")
    beneficio = request.data.get("beneficio")

    if not sucursal or not beneficio:
        return Response({"error": "Datos incompletos"}, status=400)

    trabajadores = Trabajador.objects.filter(sucursal=sucursal)

    if not trabajadores.exists():
        return Response({"error": "No hay trabajadores"}, status=404)

    count = 0
    for t in trabajadores:
        Entrega.objects.create(
            trabajador=t,
            beneficio=beneficio,
            sucursal=t.sucursal,
            area=t.area,
            tipo_contrato=t.tipo_contrato,
            periodo="----",
        )
        count += 1

    return Response({"msg": "OK", "creadas": count})


# ---------------------------------------------------------
#  ENTREGA POR GRUPO
# ---------------------------------------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def entrega_por_grupo(request):
    ids = request.data.get("trabajadores", [])
    beneficio = request.data.get("beneficio")

    if not ids or not beneficio:
        return Response({"error": "Datos incompletos"}, status=400)

    trabajadores = Trabajador.objects.filter(id__in=ids)
    if not trabajadores.exists():
        return Response({"error": "No hay trabajadores"}, status=404)

    count = 0
    for t in trabajadores:
        Entrega.objects.create(
            trabajador=t,
            beneficio=beneficio,
            sucursal=t.sucursal,
            area=t.area,
            tipo_contrato=t.tipo_contrato,
            periodo="----",
        )
        count += 1

    return Response({"msg": "OK", "creadas": count})
