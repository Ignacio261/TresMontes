from django.db import models
import uuid
from django.utils import timezone

class Reporte(models.Model):
    TIPOS_REPORTE = [
        ('entregas', 'Entregas'),
        ('trabajadores', 'Trabajadores'),
        ('qr', 'Códigos QR'),
        ('notificaciones', 'Notificaciones'),
        ('stock', 'Stock de Beneficios'),
        ('incidencias', 'Incidencias'),
        ('auditoria', 'Auditoría'),
        ('personalizado', 'Personalizado'),
    ]
    
    FORMATOS = [
        ('excel', 'Excel'),
        ('pdf', 'PDF'),
        ('csv', 'CSV'),
        ('json', 'JSON'),
        ('html', 'HTML'),
    ]
    
    FRECUENCIAS = [
        ('una_vez', 'Una Vez'),
        ('diario', 'Diario'),
        ('semanal', 'Semanal'),
        ('mensual', 'Mensual'),
        ('trimestral', 'Trimestral'),
        ('anual', 'Anual'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Información básica
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    tipo = models.CharField(max_length=20, choices=TIPOS_REPORTE)
    formato = models.CharField(max_length=10, choices=FORMATOS, default='excel')
    
    # Configuración
    activo = models.BooleanField(default=True)
    publico = models.BooleanField(default=False)  # Visible para todos los usuarios
    programado = models.BooleanField(default=False)
    
    # Programación
    frecuencia = models.CharField(max_length=20, choices=FRECUENCIAS, blank=True, null=True)
    hora_ejecucion = models.TimeField(null=True, blank=True)  # Para reportes programados
    dia_semana = models.IntegerField(null=True, blank=True, choices=[
        (1, 'Lunes'), (2, 'Martes'), (3, 'Miércoles'), 
        (4, 'Jueves'), (5, 'Viernes'), (6, 'Sábado'), (7, 'Domingo')
    ])
    dia_mes = models.IntegerField(null=True, blank=True)  # 1-31
    
    # Filtros y parámetros
    parametros = models.JSONField(default=dict, blank=True)
    filtros = models.JSONField(default=dict, blank=True)
    
    # Destinatarios
    destinatarios = models.JSONField(default=list, blank=True)  # Lista de emails
    notificar_al_completar = models.BooleanField(default=True)
    
    # Estado
    estado = models.CharField(max_length=20, choices=[
        ('activo', 'Activo'),
        ('inactivo', 'Inactivo'),
        ('pausado', 'Pausado'),
        ('error', 'Error'),
    ], default='activo')
    
    # Relaciones
    creado_por = models.ForeignKey('usuarios.Usuario', on_delete=models.SET_NULL, null=True, related_name='reportes_creados')
    
    # Auditoría
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    fecha_ultima_ejecucion = models.DateTimeField(null=True, blank=True)
    fecha_proxima_ejecucion = models.DateTimeField(null=True, blank=True)
    
    # Metadata
    metadata = models.JSONField(default=dict, blank=True)
    
    class Meta:
        db_table = 'reportes'
        ordering = ['nombre']
        indexes = [
            models.Index(fields=['tipo']),
            models.Index(fields=['estado']),
            models.Index(fields=['programado']),
        ]
    
    def __str__(self):
        return f"{self.nombre} ({self.get_tipo_display()})"
    
    def calcular_proxima_ejecucion(self):
        if not self.programado or not self.frecuencia:
            return None
        
        ahora = timezone.now()
        
        if self.frecuencia == 'diario':
            # Mañana a la misma hora
            proxima = ahora + timezone.timedelta(days=1)
        elif self.frecuencia == 'semanal' and self.dia_semana:
            # Próximo día de la semana especificado
            dias_hasta = (self.dia_semana - ahora.isoweekday()) % 7
            if dias_hasta == 0:
                dias_hasta = 7  # Siguiente semana
            proxima = ahora + timezone.timedelta(days=dias_hasta)
        elif self.frecuencia == 'mensual' and self.dia_mes:
            # Próximo día del mes
            try:
                proxima = ahora.replace(day=self.dia_mes)
                if proxima <= ahora:
                    # Si ya pasó este mes, ir al próximo mes
                    if ahora.month == 12:
                        proxima = proxima.replace(year=ahora.year + 1, month=1)
                    else:
                        proxima = proxima.replace(month=ahora.month + 1)
            except ValueError:
                # Si el día no existe en el mes (ej: 31 en febrero), usar último día
                from calendar import monthrange
                _, ultimo_dia = monthrange(ahora.year, ahora.month)
                proxima = ahora.replace(day=ultimo_dia)
        else:
            return None
        
        # Ajustar hora si está especificada
        if self.hora_ejecucion:
            proxima = proxima.replace(
                hour=self.hora_ejecucion.hour,
                minute=self.hora_ejecucion.minute,
                second=0,
                microsecond=0
            )
        
        return proxima

class EjecucionReporte(models.Model):
    """Registro de cada ejecución de un reporte"""
    ESTADOS_EJECUCION = [
        ('pendiente', 'Pendiente'),
        ('procesando', 'Procesando'),
        ('completado', 'Completado'),
        ('fallido', 'Fallido'),
        ('cancelado', 'Cancelado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reporte = models.ForeignKey(Reporte, on_delete=models.CASCADE, related_name='ejecuciones')
    
    # Información de ejecución
    estado = models.CharField(max_length=20, choices=ESTADOS_EJECUCION, default='pendiente')
    tipo_ejecucion = models.CharField(max_length=20, choices=[
        ('manual', 'Manual'),
        ('programada', 'Programada'),
        ('automatica', 'Automática')
    ], default='manual')
    
    # Parámetros específicos para esta ejecución
    parametros = models.JSONField(default=dict, blank=True)
    filtros = models.JSONField(default=dict, blank=True)
    
    # Resultados
    archivo_url = models.URLField(blank=True, null=True)
    archivo_path = models.CharField(max_length=500, blank=True, null=True)
    tamano_archivo = models.BigIntegerField(null=True, blank=True)  # En bytes
    formato = models.CharField(max_length=10, choices=Reporte.FORMATOS)
    
    # Estadísticas
    filas_generadas = models.IntegerField(null=True, blank=True)
    tiempo_procesamiento = models.FloatField(null=True, blank=True)  # En segundos
    
    # Fechas
    fecha_solicitud = models.DateTimeField(auto_now_add=True)
    fecha_inicio = models.DateTimeField(null=True, blank=True)
    fecha_fin = models.DateTimeField(null=True, blank=True)
    
    # Usuario que solicitó (si fue manual)
    solicitado_por = models.ForeignKey('usuarios.Usuario', on_delete=models.SET_NULL, null=True, blank=True)
    
    # Errores
    error = models.TextField(blank=True, null=True)
    traceback = models.TextField(blank=True, null=True)
    
    # Metadata
    metadata = models.JSONField(default=dict, blank=True)
    
    class Meta:
        db_table = 'ejecuciones_reportes'
        ordering = ['-fecha_solicitud']
        indexes = [
            models.Index(fields=['estado']),
            models.Index(fields=['fecha_solicitud']),
            models.Index(fields=['reporte', 'estado']),
        ]
    
    def __str__(self):
        return f"Ejecución {self.id} - {self.reporte.nombre}"
    
    @property
    def completado_exitosamente(self):
        return self.estado == 'completado'
    
    @property
    def tiempo_total(self):
        if self.fecha_inicio and self.fecha_fin:
            return (self.fecha_fin - self.fecha_inicio).total_seconds()
        return None

class PlantillaReporte(models.Model):
    """Plantillas para reportes personalizados"""
    TIPOS_PLANTILLA = [
        ('sql', 'SQL'),
        ('python', 'Python'),
        ('jinja2', 'Jinja2'),
        ('personalizada', 'Personalizada'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nombre = models.CharField(max_length=100)
    tipo = models.CharField(max_length=20, choices=TIPOS_PLANTILLA)
    descripcion = models.TextField(blank=True, null=True)
    
    # Contenido
    contenido = models.TextField()  # SQL, código Python, template, etc.
    configuracion = models.JSONField(default=dict, blank=True)
    
    # Variables/parámetros
    parametros = models.JSONField(default=list, blank=True)
    
    # Configuración
    activa = models.BooleanField(default=True)
    compartida = models.BooleanField(default=False)  # Para que otros usuarios la usen
    
    # Relaciones
    creado_por = models.ForeignKey('usuarios.Usuario', on_delete=models.SET_NULL, null=True)
    
    # Auditoría
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'plantillas_reportes'
        ordering = ['nombre']
    
    def __str__(self):
        return f"{self.nombre} ({self.get_tipo_display()})"

class ConfiguracionReporte(models.Model):
    """Configuración del sistema de reportes"""
    clave = models.CharField(max_length=100, unique=True)
    valor = models.TextField()
    tipo = models.CharField(max_length=20, choices=[
        ('string', 'Texto'),
        ('integer', 'Número'),
        ('boolean', 'Booleano'),
        ('json', 'JSON'),
        ('list', 'Lista')
    ], default='string')
    descripcion = models.TextField(blank=True, null=True)
    activo = models.BooleanField(default=True)
    seccion = models.CharField(max_length=50, default='general')
    
    class Meta:
        db_table = 'configuracion_reportes'
    
    def __str__(self):
        return f"{self.clave} = {self.valor}"
    
    def get_valor(self):
        import json
        if self.tipo == 'integer':
            return int(self.valor) if self.valor else 0
        elif self.tipo == 'boolean':
            return self.valor.lower() == 'true'
        elif self.tipo == 'json':
            try:
                return json.loads(self.valor)
            except:
                return {}
        elif self.tipo == 'list':
            return [item.strip() for item in self.valor.split(',') if item.strip()]
        else:
            return self.valor