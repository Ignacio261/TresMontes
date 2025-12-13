from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, update_session_auth_hash
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from .models import Usuario
from .serializers import (
    UsuarioSerializer, 
    LoginSerializer,
    CambioPasswordSerializer
)

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.filter(is_active=True)
    serializer_class = UsuarioSerializer
    
    def get_permissions(self):
        if self.action in ['login', 'me', 'registro']:
            return [AllowAny()]
        elif self.action in ['cambiar_password', 'perfil']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        if user.rol in ['rrhh_admin', 'rrhh_operador']:
            return Usuario.objects.filter(is_active=True)
        elif user.rol == 'supervisor':
            return Usuario.objects.filter(
                is_active=True,
                sucursal=user.sucursal
            )
        else:
            return Usuario.objects.filter(id=user.id)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            user = authenticate(username=username, password=password)
            
            if user and user.is_active:
                refresh = RefreshToken.for_user(user)
                
                user_data = UsuarioSerializer(user).data
                
                return Response({
                    'user': user_data,
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                })
            
            return Response(
                {'error': 'Credenciales inválidas o usuario inactivo'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def registro(self, request):
        # Solo admin puede crear usuarios
        if request.user.rol != 'rrhh_admin':
            return Response(
                {'error': 'No tienes permiso para crear usuarios'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        if request.user.is_authenticated:
            serializer = UsuarioSerializer(request.user)
            return Response(serializer.data)
        return Response({'error': 'No autenticado'}, status=401)
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        # En producción implementar blacklist de tokens
        return Response({'message': 'Sesión cerrada exitosamente'})
    
    @action(detail=False, methods=['post'])
    def cambiar_password(self, request):
        user = request.user
        serializer = CambioPasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']
            
            if not check_password(old_password, user.password):
                return Response(
                    {'error': 'Contraseña actual incorrecta'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user.set_password(new_password)
            user.save()
            update_session_auth_hash(request, user)
            
            return Response({'message': 'Contraseña cambiada exitosamente'})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['put'])
    def perfil(self, request):
        user = request.user
        serializer = UsuarioSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Solo admin puede eliminar, y no puede eliminarse a sí mismo
        if request.user.rol != 'rrhh_admin':
            return Response(
                {'error': 'No tienes permiso para eliminar usuarios'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if instance == request.user:
            return Response(
                {'error': 'No puedes eliminar tu propio usuario'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        instance.is_active = False
        instance.save()
        
        return Response(status=status.HTTP_204_NO_CONTENT)