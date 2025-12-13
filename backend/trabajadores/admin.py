# backend/trabajadores/admin.py
from django.contrib import admin
from .models import Sucursal, Departamento, Trabajador, HistorialTrabajador

@admin.register(Sucursal)
class SucursalAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'activo')
    list_filter = ('activo',)

@admin.register(Departamento)
class DepartamentoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'activo')

@admin.register(Trabajador)
class TrabajadorAdmin(admin.ModelAdmin):
    list_display = ('rut', 'nombre', 'apellido', 'sucursal', 'departamento', 'cargo', 'tipo_contrato', 'estado', 'fecha_ingreso', 'eliminado')
    list_filter = ('sucursal', 'departamento', 'tipo_contrato', 'estado')
    search_fields = ('rut', 'nombre', 'apellido', 'email', 'cargo')

@admin.register(HistorialTrabajador)
class HistorialTrabajadorAdmin(admin.ModelAdmin):
    list_display = ('trabajador', 'tipo_cambio', 'realizado_por', 'fecha_cambio')
    list_filter = ('tipo_cambio',)
    readonly_fields = ('fecha_cambio',)
