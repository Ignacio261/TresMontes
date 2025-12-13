from django.db import models
import uuid

class Entrega(models.Model):

    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('retirado', 'Retirado'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    trabajador = models.ForeignKey(
        'trabajadores.Trabajador',
        on_delete=models.CASCADE,
        related_name='entregas'
    )

    beneficio = models.CharField(max_length=50, default="Caja")

    sucursal = models.CharField(max_length=100)
    area = models.CharField(max_length=100)

    tipo_contrato = models.CharField(max_length=50)

    periodo = models.CharField(max_length=20)

    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')

    qr_id = models.UUIDField(null=True, blank=True)

    evidencia = models.ImageField(upload_to='entregas/', null=True, blank=True)

    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_retiro = models.DateTimeField(null=True, blank=True)

    creado_por = models.ForeignKey(
        'usuarios.Usuario',
        on_delete=models.SET_NULL,
        null=True,
        related_name='entregas_creadas'
    )

    class Meta:
        db_table = 'entregas'
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"{self.trabajador.nombre_completo} - {self.beneficio}"


class HistorialEntrega(models.Model):
    entrega = models.ForeignKey(Entrega, on_delete=models.CASCADE, related_name='historial')
    descripcion = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)
    realizado_por = models.ForeignKey('usuarios.Usuario', on_delete=models.SET_NULL, null=True)

    class Meta:
        db_table = 'historial_entregas'
        ordering = ['-fecha']

    def __str__(self):
        return f"Historial {self.entrega.id}"
