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
from datetime import timedelta
import pandas as pd
from io import BytesIO
from django.http import HttpResponse
from .models import Trabajador, HistorialTrabajador, Sucursal, Departamento

from rest_framework.parsers import MultiPartParser, FormParser
import openpyxl
from .serializers import (
    TrabajadorSerializer, TrabajadorCreateSerializer, TrabajadorUpdateSerializer,
    HistorialTrabajadorSerializer
)


# Paginación estandar
class StandardPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 200

# Verificar rol sencillo (ajusta según tu User model)
def is_rrhh(user):
    return getattr(user, 'rol', None) in ['admin', 'rrhh', 'rrhh_admin', 'rrhh_operador']

def is_supervisor(user):
    return getattr(user, 'rol', None) == 'supervisor'

class TrabajadorViewSet(viewsets.ModelViewSet):
    queryset = Trabajador.objects.filter(eliminado=False)
    permission_classes = [IsAuthenticated]
    pagination_class = StandardPagination
    serializer_class = TrabajadorSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['sucursal', 'tipo_contrato', 'estado', 'departamento', 'supervisor']
    search_fields = ['nombre', 'apellido', 'rut', 'email', 'cargo']
    ordering_fields = ['nombre', 'apellido', 'fecha_ingreso', 'fecha_creacion']

    def get_queryset(self):
        user = self.request.user
        qs = Trabajador.objects.filter(eliminado=False)
        if getattr(user, 'rol', None) == 'trabajador':
            return qs.filter(usuario=user)
        if is_supervisor(user):
            return qs.filter(sucursal=user.sucursal)
        return qs

    def get_serializer_class(self):
        if self.action == 'create':
            return TrabajadorCreateSerializer
        if self.action in ['update', 'partial_update']:
            return TrabajadorUpdateSerializer
        return TrabajadorSerializer

    def perform_create(self, serializer):
        with transaction.atomic():
            trabajador = serializer.save(creado_por=self.request.user)
            HistorialTrabajador.objects.create(
                trabajador=trabajador,
                tipo_cambio='otros',
                descripcion='Creación de trabajador',
                realizado_por=self.request.user
            )

    def perform_update(self, serializer):
        instance = self.get_object()
        old = TrabajadorSerializer(instance).data
        with transaction.atomic():
            trabajador = serializer.save()
            # registrar cambios relevantes
            cambios = []
            for field, new in serializer.validated_data.items():
                old_value = old.get(field)
                new_value = new
                if field in ['sucursal', 'departamento', 'supervisor'] and hasattr(new, 'id'):
                    # normalizado por uuid en serializer update
                    pass
                if str(old_value) != str(new_value) and field not in ['foto']:
                    tipo = 'otros'
                    if field == 'tipo_contrato':
                        tipo = 'contrato'
                    elif field == 'sucursal':
                        tipo = 'sucursal'
                    elif field == 'cargo':
                        tipo = 'cargo'
                    elif field == 'estado':
                        tipo = 'estado'
                    cambios.append((field, old_value, new_value, tipo))
            for campo, viejo, nuevo, tipo in cambios:
                HistorialTrabajador.objects.create(
                    trabajador=trabajador,
                    tipo_cambio=tipo,
                    descripcion=f"Cambio en {campo}",
                    valor_anterior=str(viejo),
                    valor_nuevo=str(nuevo),
                    realizado_por=self.request.user
                )

    def destroy(self, request, *args, **kwargs):
        # Solo RRHH puede eliminar
        if not is_rrhh(request.user):
            return Response({'error': 'No tienes permiso para eliminar'}, status=status.HTTP_403_FORBIDDEN)
        instance = self.get_object()
        instance.soft_delete()
        HistorialTrabajador.objects.create(
            trabajador=instance,
            tipo_cambio='estado',
            descripcion='Soft delete realizado',
            valor_anterior=instance.estado,
            valor_nuevo='inactivo',
            realizado_por=request.user
        )
        return Response(status=status.HTTP_204_NO_CONTENT)

    # Historial de un trabajador
    @action(detail=True, methods=['get'])
    def historial(self, request, pk=None):
        trab = self.get_object()
        qs = HistorialTrabajador.objects.filter(trabajador=trab)
        page = self.paginate_queryset(qs)
        ser = HistorialTrabajadorSerializer(page, many=True) if page is not None else HistorialTrabajadorSerializer(qs, many=True)
        return self.get_paginated_response(ser.data) if page is not None else Response(ser.data)

    # Estadísticas generales
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        qs = self.get_queryset()
        total = qs.count()
        por_sucursal = list(qs.values('sucursal__nombre').annotate(total=Count('id')).order_by('-total'))
        por_tipo = list(qs.values('tipo_contrato').annotate(total=Count('id')).order_by('-total'))
        por_estado = list(qs.values('estado').annotate(total=Count('id')).order_by('-total'))
        return Response({
            'total': total,
            'por_sucursal': por_sucursal,
            'por_tipo_contrato': por_tipo,
            'por_estado': por_estado
        })

    # Filtros avanzados (POST)
    @action(detail=False, methods=['post'])
    def filtros_avanzados(self, request):
        data = request.data
        qs = self.get_queryset()
        if data.get('sucursal'):
            qs = qs.filter(sucursal__id=data['sucursal'])
        if data.get('departamento'):
            qs = qs.filter(departamento__id=data['departamento'])
        if data.get('tipo_contrato'):
            qs = qs.filter(tipo_contrato=data['tipo_contrato'])
        if data.get('estado'):
            qs = qs.filter(estado=data['estado'])
        if data.get('fecha_inicio'):
            qs = qs.filter(fecha_ingreso__gte=data['fecha_inicio'])
        if data.get('fecha_fin'):
            qs = qs.filter(fecha_ingreso__lte=data['fecha_fin'])
        if data.get('search'):
            s = data['search']
            qs = qs.filter(Q(nombre__icontains=s) | Q(apellido__icontains=s) | Q(rut__icontains=s) | Q(email__icontains=s))
        page = self.paginate_queryset(qs)
        ser = TrabajadorSerializer(page, many=True) if page is not None else TrabajadorSerializer(qs, many=True)
        return self.get_paginated_response(ser.data) if page is not None else Response(ser.data)

    # Export Excel (pandas + openpyxl)
    @action(detail=False, methods=['get'])
    def exportar_excel(self, request):
        campos = request.GET.get('campos')
        if campos:
            campos = campos.split(',')
        else:
            campos = ['rut','nombre','apellido','email','telefono','sucursal__nombre','departamento__nombre','cargo','tipo_contrato','estado','fecha_ingreso']
        qs = self.get_queryset().values(*campos)
        df = pd.DataFrame(list(qs))
        # rename columns legibles
        df.columns = [c.replace('__', ' ').title() for c in df.columns]
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Trabajadores')
        output.seek(0)
        response = HttpResponse(output.read(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=trabajadores.xlsx'
        return response

    @action(detail=False, methods=['get'])
    def exportar_csv(self, request):
        campos = request.GET.get('campos')
        if campos:
            campos = campos.split(',')
        else:
            campos = ['rut','nombre','apellido','email','telefono','sucursal__nombre','departamento__nombre','cargo','tipo_contrato','estado','fecha_ingreso']
        qs = self.get_queryset().values(*campos)
        df = pd.DataFrame(list(qs))
        csv = df.to_csv(index=False, encoding='utf-8-sig')
        return HttpResponse(csv, content_type='text/csv')

    # Cumpleaños del mes
    @action(detail=False, methods=['get'])
    def cumpleanos(self, request):
        mes = timezone.now().month
        qs = self.get_queryset().filter(fecha_nacimiento__month=mes)
        ser = TrabajadorSerializer(qs, many=True)
        return Response(ser.data)

    # Aniversarios de ingreso del mes
    @action(detail=False, methods=['get'])
    def aniversarios(self, request):
        mes = timezone.now().month
        qs = self.get_queryset().filter(fecha_ingreso__month=mes)
        resultados = []
        hoy = timezone.now().date()
        for t in qs:
            anos = hoy.year - t.fecha_ingreso.year
            if (hoy.month, hoy.day) < (t.fecha_ingreso.month, t.fecha_ingreso.day):
                anos -= 1
            data = TrabajadorSerializer(t).data
            data['anos_antiguedad'] = anos
            resultados.append(data)
        return Response(resultados)



@action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser])
def carga_masiva(self, request):
    file = request.FILES.get('archivo')

    if not file:
        return Response({"error": "No se recibió ningún archivo"}, status=400)

    try:
        wb = openpyxl.load_workbook(file)
        ws = wb.active
    except Exception as e:
        return Response({"error": "Archivo inválido o corrupto"}, status=400)

    creados = 0
    errores = []

    # Iterar líneas (desde la fila 2)
    for i, row in enumerate(ws.iter_rows(min_row=2, values_only=True), start=2):
        rut, nombres, ap_paterno, ap_materno, cargo, tipo_contrato, periodo, sede, estado = row

        if not rut:
            errores.append(f"Fila {i}: RUT vacío")
            continue

        try:
            Trabajador.objects.create(
                rut=rut,
                nombre=nombres,
                apellido=f"{ap_paterno} {ap_materno}",
                cargo=cargo,
                tipo_contrato="indefinido" if tipo_contrato.lower() == "indefinido" else "plazo_fijo",
                sucursal=sede,
                departamento="No asignado",
                estado="activo" if estado.lower() == "pendiente" else "inactivo",
                fecha_ingreso="2025-01-01",
                telefono="",
                email=f"{rut.replace('-', '').replace('.', '')}@empresa.cl",
                creado_por=request.user
            )
            creados += 1

        except Exception as e:
            errores.append(f"Fila {i}: {str(e)}")

    return Response({
        "mensaje": "Carga masiva procesada",
        "creados": creados,
        "errores": errores
    }, status=200)
