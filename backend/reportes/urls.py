from django.urls import path
from .views import ReporteEntregaListView, ExportarExcelView, ExportarCSVView, ExportarPDFView

urlpatterns = [
    path('entregas/', ReporteEntregaListView.as_view(), name='reportes-entregas'),
    path('entregas/export/excel/', ExportarExcelView.as_view(), name='exportar-excel'),
    path('entregas/export/csv/', ExportarCSVView.as_view(), name='exportar-csv'),
    path('entregas/export/pdf/', ExportarPDFView.as_view(), name='exportar-pdf'),
]
