from rest_framework import serializers
from .models import Sucursal, Area, Beneficio, Periodo, ParametroSistema

class SucursalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sucursal
        fields = '__all__'
        read_only_fields = ['id']


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'
        read_only_fields = ['id']


class BeneficioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Beneficio
        fields = '__all__'
        read_only_fields = ['id']


class PeriodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Periodo
        fields = '__all__'
        read_only_fields = ['id']


class ParametroSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParametroSistema
        fields = '__all__'
        read_only_fields = ['id']
