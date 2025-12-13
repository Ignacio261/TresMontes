from rest_framework import serializers
from entregas.models import Entrega
from trabajadores.models import Trabajador

class ReporteEntregaSerializer(serializers.ModelSerializer):
    trabajador_rut = serializers.CharField(source="trabajador.rut", read_only=True)
    trabajador_nombre = serializers.CharField(source="trabajador.nombres", read_only=True)
    trabajador_apellidos = serializers.CharField(source="trabajador.apellidos", read_only=True)

    class Meta:
        model = Entrega
        fields = [
            'id',
            'fecha_entrega',
            'beneficio',
            'sede',
            'estado',
            'observaciones',
            'evidencia',
            'trabajador_rut',
            'trabajador_nombre',
            'trabajador_apellidos',
        ]
