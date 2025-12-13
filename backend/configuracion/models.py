from django.db import models
import uuid

class Sucursal(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nombre = models.CharField(max_length=200, unique=True)
    direccion = models.CharField(max_length=300, blank=True, null=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'config_sucursales'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Area(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nombre = models.CharField(max_length=200, unique=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'config_areas'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Beneficio(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'config_beneficios'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Periodo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    clave = models.CharField(max_length=50, unique=True)  # ej: Dic-25
    fecha_inicio = models.DateField(null=True, blank=True)
    fecha_fin = models.DateField(null=True, blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'config_periodos'
        ordering = ['-fecha_inicio']

    def __str__(self):
        return self.clave


class ParametroSistema(models.Model):
    id = models.AutoField(primary_key=True)
    clave = models.CharField(max_length=100, unique=True)
    valor = models.CharField(max_length=500, blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'config_parametros'
        ordering = ['clave']

    def __str__(self):
        return f"{self.clave}={self.valor}"
