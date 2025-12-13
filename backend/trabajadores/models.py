# backend/trabajadores/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid
from datetime import date

# -------------------------
# Sucursal y Departamento
# -------------------------
class Sucursal(models.Model):
    NOMBRE_CHOICES = (
        ('Casablanca', 'Casablanca'),
        ('Valparaíso Planta BIF', 'Valparaíso Planta BIF'),
        ('Valparaíso Planta BIC', 'Valparaíso Planta BIC'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nombre = models.CharField(max_length=100, choices=NOMBRE_CHOICES, unique=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'sucursales'
        verbose_name = 'Sucursal'
        verbose_name_plural = 'Sucursales'

    def __str__(self):
        return self.nombre

class Departamento(models.Model):
    NOMBRE_CHOICES = (
        ('Producción', 'Producción'),
        ('Logística', 'Logística'),
        ('Administración', 'Administración'),
        ('Recursos Humanos', 'Recursos Humanos'),
        ('Mantención', 'Mantención'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nombre = models.CharField(max_length=100, choices=NOMBRE_CHOICES, unique=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'departamentos'
        verbose_name = 'Departamento'
        verbose_name_plural = 'Departamentos'

    def __str__(self):
        return self.nombre


# -------------------------
# Trabajador
# -------------------------
class Trabajador(models.Model):
    TIPO_CONTRATO = [
        ('indefinido', 'Indefinido'),
        ('plazo_fijo', 'Plazo Fijo'),
    ]

    ESTADOS = [
        ('activo', 'Activo'),
        ('inactivo', 'Inactivo'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rut = models.CharField(max_length=12, unique=True, db_index=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=30, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)

    sucursal = models.ForeignKey(Sucursal, on_delete=models.PROTECT, related_name='trabajadores')
    departamento = models.ForeignKey(Departamento, on_delete=models.PROTECT, related_name='trabajadores')
    cargo = models.CharField(max_length=100, blank=True, null=True)

    tipo_contrato = models.CharField(max_length=20, choices=TIPO_CONTRATO, default='indefinido')
    estado = models.CharField(max_length=20, choices=ESTADOS, default='activo')

    supervisor = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subordinados')

    fecha_ingreso = models.DateField()
    fecha_nacimiento = models.DateField(null=True, blank=True)

    foto = models.ImageField(upload_to='trabajadores/', null=True, blank=True)

    # Integración con sistema de usuarios (opcional)
    usuario = models.OneToOneField(getattr(settings, 'AUTH_USER_MODEL', 'auth.User'),
                                   on_delete=models.SET_NULL, null=True, blank=True, related_name='trabajador')

    # Auditoría / sistema
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    eliminado = models.BooleanField(default=False)
    creado_por = models.ForeignKey(getattr(settings, 'AUTH_USER_MODEL', 'auth.User'),
                                   on_delete=models.SET_NULL, null=True, blank=True, related_name='trabajadores_creados')

    class Meta:
        db_table = 'trabajadores'
        ordering = ['-fecha_creacion']
        verbose_name = 'Trabajador'
        verbose_name_plural = 'Trabajadores'

    def __str__(self):
        return f"{self.nombre} {self.apellido} ({self.rut}) - {self.sucursal}"

    @property
    def nombre_completo(self):
        return f"{self.nombre} {self.apellido}"

    @property
    def edad(self):
        if not self.fecha_nacimiento:
            return None
        today = date.today()
        y = today.year - self.fecha_nacimiento.year
        if (today.month, today.day) < (self.fecha_nacimiento.month, self.fecha_nacimiento.day):
            y -= 1
        return y

    def soft_delete(self):
        self.eliminado = True
        self.estado = 'inactivo'
        self.save()

    def tiene_qr_estado(self):
        """
        Intenta recuperar estado QR desde app qr_system (si está instalada).
        Retorna: {'estado_simplificado': 'no_generado'|'generado'|'enviado'|'otro', 'qr_id': id or None}
        """
        try:
            from qr_system.models import CodigoQR
        except Exception:
            return {'estado_simplificado': 'no_disponible', 'qr_id': None}

        qr = CodigoQR.objects.filter(trabajador__id=self.id).order_by('-fecha_generacion').first()
        if not qr:
            return {'estado_simplificado': 'no_generado', 'qr_id': None}
        if qr.estado == 1:
            return {'estado_simplificado': 'generado', 'qr_id': str(qr.id)}
        if qr.estado == 2:
            return {'estado_simplificado': 'enviado', 'qr_id': str(qr.id)}
        return {'estado_simplificado': 'otro', 'qr_id': str(qr.id)}


# -------------------------
# Historial de cambios
# -------------------------
class HistorialTrabajador(models.Model):
    TIPO_CAMBIO = [
        ('contrato', 'Cambio de Contrato'),
        ('sucursal', 'Cambio de Sucursal'),
        ('cargo', 'Cambio de Cargo'),
        ('estado', 'Cambio de Estado'),
        ('salario', 'Cambio de Salario'),
        ('otros', 'Otros Cambios'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trabajador = models.ForeignKey(Trabajador, on_delete=models.CASCADE, related_name='historial')
    tipo_cambio = models.CharField(max_length=20, choices=TIPO_CAMBIO)
    descripcion = models.TextField()
    valor_anterior = models.TextField(blank=True, null=True)
    valor_nuevo = models.TextField(blank=True, null=True)
    realizado_por = models.ForeignKey(getattr(settings, 'AUTH_USER_MODEL', 'auth.User'),
                                      on_delete=models.SET_NULL, null=True, blank=True)
    fecha_cambio = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'historial_trabajadores'
        ordering = ['-fecha_cambio']

    def __str__(self):
        return f"{self.trabajador.nombre_completo} - {self.get_tipo_cambio_display()}"
