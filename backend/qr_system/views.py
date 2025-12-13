# qr_system/views.py

import os
import uuid
import qrcode
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated

from .models import QRRegistro
from trabajadores.models import Trabajador
from .serializers import QRRegistroSerializer
from .utils import generar_hash, generar_qr_imagen


# -------------------------
# LISTAR REGISTROS QR
# -------------------------
class QRListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        registros = QRRegistro.objects.select_related("trabajador").all()
        serializer = QRRegistroSerializer(registros, many=True)
        return Response(serializer.data)


# -------------------------
# GENERAR QR INDIVIDUAL
# -------------------------
class GenerarQRView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, trabajador_id):
        trabajador = get_object_or_404(Trabajador, pk=trabajador_id)

        registro, created = QRRegistro.objects.get_or_create(trabajador=trabajador)

        # Generar hash + QR
        registro.hash_validacion = generar_hash()
        registro.fecha_generado = timezone.now()
        registro.estado = "GENERADO"

        contenido = f"ID:{trabajador.id}|HASH:{registro.hash_validacion}"
        filename = f"qr_{trabajador.id}.png"
        ruta = generar_qr_imagen(contenido, filename)

        registro.qr_imagen = ruta
        registro.save()

        return Response({"message": "QR generado correctamente"}, status=200)


# -------------------------
# DESCARGAR QR INDIVIDUAL
# -------------------------
class DescargarQRView(APIView):
    def get(self, request, trabajador_id):
        registro = get_object_or_404(QRRegistro, trabajador_id=trabajador_id)

        if not registro.qr_imagen:
            return Response({"error": "QR no generado"}, status=400)

        return FileResponse(open(registro.qr_imagen.path, "rb"), content_type="image/png")


# -------------------------
# ENVIAR QR POR CORREO (SIMULADO)
# -------------------------
class EnviarQREmailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, trabajador_id):
        registro = get_object_or_404(QRRegistro, trabajador_id=trabajador_id)

        # Solo simulado
        registro.fecha_enviado = timezone.now()
        registro.enviado_email = True
        registro.estado = "ENVIADO"
        registro.save()

        return Response({"message": "QR enviado (modo simulado)"}, status=200)


# -------------------------
# GENERAR QR MASIVO
# -------------------------
class GenerarQRMasivoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        trabajadores = Trabajador.objects.filter(qr_codigo__isnull=True)

        if not trabajadores.exists():
            return Response({"message": "Todos los trabajadores ya tienen QR"}, status=200)

        count = 0

        # Crear carpeta si no existe
        qr_dir = os.path.join(settings.MEDIA_ROOT, "qr_codes")
        os.makedirs(qr_dir, exist_ok=True)

        for t in trabajadores:
            codigo = f"QR-{uuid.uuid4()}"
            t.qr_codigo = codigo
            t.qr_estado = "GENERADO"
            t.qr_generado_en = timezone.now()

            qr_path = os.path.join(qr_dir, f"qr_{t.id}.png")

            # Generar imagen QR
            qr_img = qrcode.make(f"{t.id}|{codigo}|{timezone.now().timestamp()}")
            qr_img.save(qr_path)

            t.save()
            count += 1

        return Response({"message": f"QR generados para {count} trabajadores"}, status=200)


# -------------------------
# ENVIAR QR MASIVO (SIMULADO)
# -------------------------
class EnviarQRMasivoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        trabajadores = Trabajador.objects.filter(qr_codigo__isnull=False)

        if not trabajadores.exists():
            return Response({"message": "No hay QR generados para enviar"}, status=200)

        enviados = 0

        for t in trabajadores:
            # Modo simulado
            t.qr_estado = "ENVIADO"
            t.qr_enviado_en = timezone.now()
            t.save()
            enviados += 1

        return Response(
            {"message": f"Correos enviados correctamente (simulado): {enviados}"},
            status=200
        )

class QRListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        registros = QRRegistro.objects.select_related("trabajador").all()
        serializer = QRRegistroSerializer(registros, many=True)
        return Response(serializer.data)

    @staticmethod
    def count(request):
        cantidad = QRRegistro.objects.count()
        return Response({"cantidad": cantidad})
