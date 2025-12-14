# backend/trabajadores/views.py
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from django.db import transaction
from django.utils import timezone
from datetime import date
from django.http import HttpResponse
from io import BytesIO

import pandas as pd
import openpyxl

from rest_framework.parsers import MultiPartParser, FormParser

from .models import Trabajador, HistorialTrabajador, Sucursal, Departamento
from .serializers import (
    TrabajadorSerializer,
    TrabajadorCreateSerializer,
    TrabajadorUpdateSerializer,
    HistorialTrabajadorSerializer
)

# --------------------------------------------------
# Paginación estándar
# --------------------------------------------------
class StandardPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 200


def is_rrhh(user):
    return getattr(user, 'rol', None) in ['admin', 'rrhh', 'rrhh_admin', 'rrhh_operador']


def is_supervisor(user):
    return getattr(user, 'rol', None) == 'supervisor'


class TrabajadorViewSet(viewsets.ModelViewSet):
    queryset = Trabajador.objects.filter(eliminado=False)
    permission_classes = [IsAuthenticated]
    pagination_class = StandardPagination
    serializer_class = TrabajadorSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]

    filterset_fields = ['sucursal', 'departamento', 'tipo_contrato', 'estado']
    search_fields = ['nombre', 'apellido', 'rut', 'email', 'cargo']
    ordering_fields = ['nombre', 'apellido', 'fecha_ingreso', 'fecha_creacion']

    # --------------------------------------------------
    # Queryset por rol
    # --------------------------------------------------
    def get_queryset(self):
        user = self.request.user
        qs = Trabajador.objects.filter(eliminado=False)

        if is_supervisor(user):
            return qs.filter(sucursal=user.sucursal)

        return qs

    # --------------------------------------------------
    # Serializers por acción
    # --------------------------------------------------
    def get_serializer_class(self):
        if self.action == 'create':
            return TrabajadorCreateSerializer
        if self.action in ['update', 'partial_update']:
            return TrabajadorUpdateSerializer
        return TrabajadorSerializer

    # --------------------------------------------------
    # Crear trabajador
    # --------------------------------------------------
    def perform_create(self, serializer):
        with transaction.atomic():
            trabajador = serializer.save(creado_por=self.request.user)
            HistorialTrabajador.objects.create(
                trabajador=trabajador,
                tipo_cambio='otros',
                descripcion='Creación de trabajador',
                realizado_por=self.request.user
            )

    # --------------------------------------------------
    # Historial trabajador
    # --------------------------------------------------
    @action(detail=True, methods=['get'])
    def historial(self, request, pk=None):
        trabajador = self.get_object()
        qs = HistorialTrabajador.objects.filter(trabajador=trabajador)
        serializer = HistorialTrabajadorSerializer(qs, many=True)
        return Response(serializer.data)

    # --------------------------------------------------
    # EXPORTACIONES
    # --------------------------------------------------
    @action(detail=False, methods=['get'])
    def exportar_excel(self, request):
        qs = self.get_queryset().values(
            'rut', 'nombre', 'apellido', 'email',
            'telefono', 'cargo',
            'sucursal__nombre',
            'departamento__nombre',
            'tipo_contrato', 'estado',
            'fecha_ingreso'
        )

        df = pd.DataFrame(list(qs))
        output = BytesIO()

        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Trabajadores')

        output.seek(0)

        response = HttpResponse(
            output.read(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=trabajadores.xlsx'
        return response

    # --------------------------------------------------
    # CARGA MASIVA (EXCEL)
    # --------------------------------------------------
    @action(
        detail=False,
        methods=['post'],
        parser_classes=[MultiPartParser, FormParser]
    )
    def carga_masiva(self, request):
        archivo = request.FILES.get('archivo')

        if not archivo:
            return Response(
                {"error": "No se recibió archivo"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            wb = openpyxl.load_workbook(archivo)
            ws = wb.active
        except Exception:
            return Response(
                {"error": "Archivo inválido"},
                status=status.HTTP_400_BAD_REQUEST
            )

        creados = 0
        errores = []

        for i, row in enumerate(ws.iter_rows(min_row=2, values_only=True), start=2):
            try:
                rut, nombre, apellido, email, cargo, sucursal_nombre, depto_nombre = row

                sucursal = Sucursal.objects.get(nombre=sucursal_nombre)
                departamento = Departamento.objects.get(nombre=depto_nombre)

                Trabajador.objects.create(
                    rut=rut,
                    nombre=nombre,
                    apellido=apellido,
                    email=email,
                    cargo=cargo,
                    sucursal=sucursal,
                    departamento=departamento,
                    tipo_contrato='indefinido',
                    estado='activo',
                    fecha_ingreso=date.today(),
                    creado_por=request.user
                )
                creados += 1

            except Exception as e:
                errores.append(f"Fila {i}: {str(e)}")

        return Response({
            "creados": creados,
            "errores": errores
        })
