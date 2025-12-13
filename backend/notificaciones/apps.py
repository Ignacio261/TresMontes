from django.apps import AppConfig

class NotificacionesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'notificaciones'
    
    def ready(self):
        # Comentar o eliminar la línea de signals si no existe el archivo
        # import notificaciones.signals  # Solo descomentar si tienes signals.py
        
        # O puedes usar try-except para evitar el error
        try:
            import notificaciones.signals
        except ImportError:
            pass  # No hay señales, no pasa nada