from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    ROLES = [
        ('rrhh_admin', 'Administrador RRHH'),
        ('rrhh_operador', 'Operador RRHH'),
        ('supervisor', 'Supervisor'),
        ('trabajador', 'Trabajador'),
    ]
    
    rol = models.CharField(max_length=20, choices=ROLES, default='trabajador')
    sucursal = models.CharField(max_length=100, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'usuarios'
    
    def __str__(self):
        return f"{self.username} - {self.get_rol_display()}"