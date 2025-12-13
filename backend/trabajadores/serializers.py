# backend/trabajadores/serializers.py
from rest_framework import serializers
from .models import Trabajador, HistorialTrabajador, Sucursal, Departamento
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
import re

User = get_user_model()

# -------------------------
# Validación RUT (Chile)
# -------------------------
def limpiar_rut(rut: str) -> str:
    return re.sub(r'[^0-9kK]', '', rut).upper()

def validar_rut_chileno(rut: str) -> bool:
    rut_s = limpiar_rut(rut)
    if len(rut_s) < 2:
        return False
    cuerpo, dig = rut_s[:-1], rut_s[-1]
    try:
        suma = 0
        multiplicador = 2
        for c in reversed(cuerpo):
            suma += int(c) * multiplicador
            multiplicador = 3 if multiplicador == 7 else multiplicador + 1
        resto = suma % 11
        dv = 11 - resto
        dv_char = 'K' if dv == 10 else '0' if dv == 11 else str(dv)
        return dv_char == dig
    except Exception:
        return False

# -------------------------
# Serializers
# -------------------------
class SucursalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sucursal
        fields = ['id', 'nombre', 'activo']

class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departamento
        fields = ['id', 'nombre', 'activo']

class TrabajadorSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.CharField(read_only=True)
    edad = serializers.IntegerField(read_only=True)
    sucursal = SucursalSerializer(read_only=True)
    departamento = DepartamentoSerializer(read_only=True)
    supervisor_nombre = serializers.SerializerMethodField()
    qr_estado = serializers.SerializerMethodField()

    class Meta:
        model = Trabajador
        fields = '__all__'
        read_only_fields = ['id', 'fecha_creacion', 'fecha_actualizacion', 'usuario', 'eliminado', 'creado_por']

    def get_supervisor_nombre(self, obj):
        return obj.supervisor.nombre_completo if obj.supervisor else None

    def get_qr_estado(self, obj):
        try:
            return obj.tiene_qr_estado()
        except Exception:
            return {'estado_simplificado': 'no_disponible', 'qr_id': None}


class TrabajadorCreateSerializer(serializers.ModelSerializer):
    crear_usuario = serializers.BooleanField(default=False, write_only=True)
    username = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False)

    sucursal = serializers.UUIDField()
    departamento = serializers.UUIDField()

    class Meta:
        model = Trabajador
        fields = [
            'rut', 'nombre', 'apellido', 'email', 'telefono', 'direccion',
            'sucursal', 'departamento', 'cargo', 'tipo_contrato', 'estado',
            'supervisor', 'fecha_ingreso', 'fecha_nacimiento',
            'crear_usuario', 'username', 'password'
        ]

    def validate_rut(self, value):
        if not validar_rut_chileno(value):
            raise serializers.ValidationError('RUT inválido')
        return limpiar_rut(value)

    def validate(self, data):
        # verificar existencia de sucursal y departamento
        from .models import Sucursal, Departamento
        try:
            Sucursal.objects.get(id=data['sucursal'])
        except Sucursal.DoesNotExist:
            raise serializers.ValidationError({'sucursal': 'Sucursal no válida'})

        try:
            Departamento.objects.get(id=data['departamento'])
        except Departamento.DoesNotExist:
            raise serializers.ValidationError({'departamento': 'Departamento no válido'})

        return data

    def create(self, validated_data):
        crear_usuario = validated_data.pop('crear_usuario', False)
        username = validated_data.pop('username', None)
        password = validated_data.pop('password', None)

        sucursal_id = validated_data.pop('sucursal')
        departamento_id = validated_data.pop('departamento')
        validated_data['sucursal'] = Sucursal.objects.get(id=sucursal_id)
        validated_data['departamento'] = Departamento.objects.get(id=departamento_id)

        trabajador = Trabajador.objects.create(**validated_data)

        if crear_usuario and username:
            # crear usuario básico
            user = User.objects.create(
                username=username,
                email=trabajador.email,
                first_name=trabajador.nombre,
                last_name=trabajador.apellido,
                password=make_password(password or 'temporal123'),
            )
            trabajador.usuario = user
            trabajador.save()

        return trabajador

class TrabajadorUpdateSerializer(serializers.ModelSerializer):
    sucursal = serializers.UUIDField(required=False)
    departamento = serializers.UUIDField(required=False)

    class Meta:
        model = Trabajador
        fields = [
            'nombre', 'apellido', 'email', 'telefono', 'direccion',
            'sucursal', 'departamento', 'cargo', 'tipo_contrato', 'estado',
            'supervisor', 'fecha_ingreso', 'fecha_nacimiento', 'foto'
        ]

    def update(self, instance, validated_data):
        # mapear sucursal/departamento si vienen como uuid
        if validated_data.get('sucursal'):
            from .models import Sucursal
            instance.sucursal = Sucursal.objects.get(id=validated_data.pop('sucursal'))
        if validated_data.get('departamento'):
            from .models import Departamento
            instance.departamento = Departamento.objects.get(id=validated_data.pop('departamento'))
        return super().update(instance, validated_data)


class HistorialTrabajadorSerializer(serializers.ModelSerializer):
    realizado_por_nombre = serializers.SerializerMethodField()
    trabajador_nombre = serializers.SerializerMethodField()

    class Meta:
        model = HistorialTrabajador
        fields = '__all__'
        read_only_fields = ['fecha_cambio']

    def get_realizado_por_nombre(self, obj):
        return obj.realizado_por.get_full_name() if obj.realizado_por else None

    def get_trabajador_nombre(self, obj):
        return obj.trabajador.nombre_completo
