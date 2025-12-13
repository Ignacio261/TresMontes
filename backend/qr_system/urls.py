from django.urls import path
from .views import (
    QRListView,
    GenerarQRView,
    DescargarQRView,
    EnviarQREmailView,
    GenerarQRMasivoView,
    EnviarQRMasivoView,
)

urlpatterns = [
    path('', QRListView.as_view()),

    path('generar/<int:trabajador_id>/', GenerarQRView.as_view()),
    path('descargar/<int:trabajador_id>/', DescargarQRView.as_view()),
    path('enviar-email/<int:trabajador_id>/', EnviarQREmailView.as_view()),

    path('generar-masivo/', GenerarQRMasivoView.as_view()),
    path('enviar-masivo/', EnviarQRMasivoView.as_view()),
]
