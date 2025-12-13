from rest_framework import serializers
from trabajadores.models import Trabajador
from .models import Entrega, HistorialEntrega


class TrabajadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trabajador
        fields = "__all__"


class EntregaSerializer(serializers.ModelSerializer):
    trabajador = TrabajadorSerializer(read_only=True)

    class Meta:
        model = Entrega
        fields = "__all__"


class EntregaCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrega
        fields = "__all__"


class HistorialEntregaSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialEntrega
        fields = "__all__"


class EntregaDetalleSerializer(serializers.ModelSerializer):
    trabajador = TrabajadorSerializer(read_only=True)
    historial = HistorialEntregaSerializer(many=True, read_only=True)

    class Meta:
        model = Entrega
        fields = "__all__"
