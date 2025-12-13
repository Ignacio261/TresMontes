# backend/notificaciones/serializers.py
from rest_framework import serializers
from .models import Notificacion

class NotificacionSerializer(serializers.ModelSerializer):
    trabajador_nombre = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Notificacion
        fields = "__all__"
        read_only_fields = ("creado_en",)

    def get_trabajador_nombre(self, obj):
        return obj.trabajador.nombre_completo if obj.trabajador else None
