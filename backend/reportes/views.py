from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from entregas.models import Entrega
from trabajadores.models import Trabajador

# EXPORTACIONES
from django.http import HttpResponse
import csv
import openpyxl
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


class ReporteEntregaListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search = request.query_params.get("search", "")
        estado = request.query_params.get("estado")
        sucursal = request.query_params.get("sucursal")

        qs = Entrega.objects.select_related("trabajador").all()

        if search:
            qs = qs.filter(
                Q(trabajador__rut__icontains=search) |
                Q(trabajador__nombres__icontains=search) |
                Q(trabajador__apellido_paterno__icontains=search) |
                Q(trabajador__apellido_materno__icontains=search)
            )

        if estado:
            qs = qs.filter(estado=estado)

        if sucursal:
            qs = qs.filter(trabajador__sucursal=sucursal)

        data = []
        for e in qs:
            data.append({
                "id": str(e.id),
                "rut": e.trabajador.rut,
                "nombre": e.trabajador.nombre_completo,
                "sucursal": e.trabajador.sucursal,
                "beneficio": e.beneficio,
                "estado": e.estado,
                "fecha": e.fecha_creacion.strftime("%Y-%m-%d %H:%M")
            })

        return Response(data)


# --------------------------------------------------------------------
#  EXCEL
# --------------------------------------------------------------------
class ExportarExcelView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Entrega.objects.select_related("trabajador").all()

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Reporte"

        columnas = ["RUT", "Nombre", "Sucursal", "Beneficio", "Estado", "Fecha"]
        ws.append(columnas)

        for e in qs:
            ws.append([
                e.trabajador.rut,
                e.trabajador.nombre_completo,
                e.trabajador.sucursal,
                e.beneficio,
                e.estado,
                e.fecha_creacion.strftime("%Y-%m-%d"),
            ])

        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response["Content-Disposition"] = 'attachment; filename="reporte.xlsx"'

        wb.save(response)
        return response


# --------------------------------------------------------------------
#  CSV
# --------------------------------------------------------------------
class ExportarCSVView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Entrega.objects.select_related("trabajador").all()

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename=reporte.csv'

        writer = csv.writer(response)
        writer.writerow(["RUT", "Nombre", "Sucursal", "Beneficio", "Estado", "Fecha"])

        for e in qs:
            writer.writerow([
                e.trabajador.rut,
                e.trabajador.nombre_completo,
                e.trabajador.sucursal,
                e.beneficio,
                e.estado,
                e.fecha_creacion.strftime("%Y-%m-%d"),
            ])

        return response


# --------------------------------------------------------------------
#  PDF
# --------------------------------------------------------------------
class ExportarPDFView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Entrega.objects.select_related("trabajador").all()

        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = 'attachment; filename="reporte.pdf"'

        pdf = canvas.Canvas(response, pagesize=letter)
        width, height = letter

        y = height - 40
        pdf.setFont("Helvetica-Bold", 14)
        pdf.drawString(50, y, "Reporte de Entregas")
        y -= 30

        pdf.setFont("Helvetica", 9)

        for e in qs:
            linea = (
                f"{e.trabajador.rut} - {e.trabajador.nombre_completo} - "
                f"{e.trabajador.sucursal} - {e.beneficio} - {e.estado}"
            )
            pdf.drawString(50, y, linea)
            y -= 15

            if y < 50:
                pdf.showPage()
                y = height - 40
                pdf.setFont("Helvetica", 9)

        pdf.save()
        return response
