# notificaciones/signals.py
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Notificacion, HistorialEnvioNotificacion
from django.utils import timezone

@receiver(pre_save, sender=Notificacion)
def notificacion_pre_save(sender, instance, **kwargs):
    """Lógica antes de guardar una notificación"""
    # Si la notificación está programada para ahora o antes, cambiar estado
    if instance.estado == 'borrador' and instance.fecha_programacion:
        if instance.fecha_programacion <= timezone.now():
            instance.estado = 'programada'
    
    # Si se está enviando, establecer fecha de envío
    if instance.estado == 'enviando' and not instance.fecha_envio:
        instance.fecha_envio = timezone.now()

@receiver(post_save, sender=HistorialEnvioNotificacion)
def historial_post_save(sender, instance, created, **kwargs):
    """Lógica después de guardar un historial de envío"""
    if created and instance.estado == 'leido':
        # Actualizar la fecha de lectura de la notificación
        notificacion = instance.notificacion
        if not notificacion.fecha_lectura:
            notificacion.fecha_lectura = timezone.now()
            notificacion.save(update_fields=['fecha_lectura'])