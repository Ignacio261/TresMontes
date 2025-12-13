from rest_framework import serializers
from .models import QRRegistro
from trabajadores.models import Trabajador


class QRTrabajadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trabajador
        fields = ["id", "nombres", "apellido_paterno", "apellido_materno",
                  "sucursal", "tipo_contrato", "estado"]


class QRRegistroSerializer(serializers.ModelSerializer):
    trabajador = QRTrabajadorSerializer(read_only=True)

    class Meta:
        model = QRRegistro
        fields = "__all__"
