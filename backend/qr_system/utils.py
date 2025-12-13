import qrcode
import hashlib
import uuid
from django.conf import settings
import os

def generar_hash():
    return hashlib.sha256(uuid.uuid4().hex.encode()).hexdigest()


def generar_qr_imagen(texto, filename):
    img = qrcode.make(texto)

    output_path = os.path.join(settings.MEDIA_ROOT, "qr_codes")
    os.makedirs(output_path, exist_ok=True)

    full_path = os.path.join(output_path, filename)
    img.save(full_path)
    return f"qr_codes/{filename}"
