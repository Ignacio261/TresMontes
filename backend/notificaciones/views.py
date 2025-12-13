# backend/notificaciones/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404

from .models import Notificacion
from .serializers import NotificacionSerializer

from trabajadores.models import Trabajador


class NotificacionViewSet(viewsets.ModelViewSet):
    queryset = Notificacion.objects.all().order_by("-creado_en")
    serializer_class = NotificacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Si el usuario es staff → ve todo.
        Si es trabajador → ve solo sus propias notificaciones.
        """
        user = self.request.user

        if user.is_staff:
            return Notificacion.objects.all().order_by("-creado_en")

        try:
            trab = user.trabajador
            return Notificacion.objects.filter(usuario=user).order_by("-creado_en")
        except:
            return Notificacion.objects.none()

    # ============================================================
    # ENVIAR NOTIFICACIÓN (INDIVIDUAL / POR SUCURSAL / DEPARTAMENTO)
    # ============================================================
    @action(detail=False, methods=["post"])
    def enviar(self, request):
        tipo_envio = request.data.get("tipo")  # "individual", "sucursal", "departamento"
        trabajador_id = request.data.get("trabajador_id")
        sucursal_id = request.data.get("sucursal_id")
        departamento_id = request.data.get("departamento_id")
        titulo = request.data.get("titulo", "Tu beneficio está disponible")
        mensaje = request.data.get("mensaje", "Estimado trabajador, ya puedes retirar tu beneficio.")

        trabajadores = []

        if tipo_envio == "individual":
            trabajadores.append(get_object_or_404(Trabajador, id=trabajador_id))

        elif tipo_envio == "sucursal":
            trabajadores = Trabajador.objects.filter(sucursal_id=sucursal_id, eliminado=False)

        elif tipo_envio == "departamento":
            trabajadores = Trabajador.objects.filter(departamento_id=departamento_id, eliminado=False)

        else:
            return Response({"error": "Tipo de envío inválido"}, status=400)

        creadas = 0

        # Crear notificaciones + enviar email
        for t in trabajadores:
            Notificacion.objects.create(
                usuario=t.usuario,
                titulo=titulo,
                mensaje=mensaje,
                tipo="info"
            )

            # Envío de correo (modo real si configuras EMAIL_HOST)
            try:
                send_mail(
                    subject=titulo,
                    message=mensaje,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[t.email],
                    fail_silently=True
                )
            except:
                pass

            creadas += 1

        return Response({"ok": True, "cantidad": creadas}, status=200)

    # ============================================================
    # MARCAR UNA NOTIFICACIÓN COMO LEÍDA
    # ============================================================
    @action(detail=True, methods=["post"])
    def leer(self, request, pk=None):
        noti = self.get_object()
        noti.leido = True
        noti.save()
        return Response({"ok": True})

    # ============================================================
    # MARCAR TODAS COMO LEÍDAS
    # ============================================================
    @action(detail=False, methods=["post"])
    def leer_todas(self, request):
        user = request.user
        Notificacion.objects.filter(usuario=user, leido=False).update(leido=True)
        return Response({"ok": True})
