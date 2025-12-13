# backend/notificaciones/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone
from trabajadores.models import Trabajador

class Notificacion(models.Model):

    TIPOS = [
        ("info", "Información"),
        ("warning", "Advertencia"),
        ("success", "Éxito"),
        ("entrega", "Entrega"),
    ]

    # Notificación vinculada a un trabajador (puede ser null si se envía masivamente sin asignar)
    trabajador = models.ForeignKey(
        Trabajador,
        on_delete=models.CASCADE,
        related_name="notificaciones",
        null=True,
        blank=True
    )

    titulo = models.CharField(max_length=255)
    mensaje = models.TextField()
    tipo = models.CharField(max_length=20, choices=TIPOS, default="info")
    leido = models.BooleanField(default=False)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-creado_en"]

    def __str__(self):
        target = self.trabajador.nombre_completo if self.trabajador else "Todos"
        return f"{target} - {self.titulo}"
