from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Usuario
        fields = [
            'id', 'username', 'email', 'password', 'confirm_password',
            'first_name', 'last_name', 'rol', 'sucursal', 'telefono', 
            'activo', 'date_joined', 'fecha_creacion'
        ]
        read_only_fields = ['id', 'date_joined', 'fecha_creacion']
    
    def validate(self, data):
        if 'password' in data and 'confirm_password' not in data:
            raise serializers.ValidationError(
                {"confirm_password": "Debe confirmar la contraseña"}
            )
        
        if 'password' in data and 'confirm_password' in data:
            if data['password'] != data['confirm_password']:
                raise serializers.ValidationError(
                    {"password": "Las contraseñas no coinciden"}
                )
        
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        validated_data.pop('confirm_password', None)
        
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        
        return super().update(instance, validated_data)

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class CambioPasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)
    
    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError(
                {"confirm_password": "Las contraseñas no coinciden"}
            )
        return data