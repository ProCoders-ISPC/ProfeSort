import os
import django
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.usuarios.models import Rol, Usuario
from datetime import datetime
from django.utils import timezone

def init_roles():
    roles_data = [
        {"nombre": "Administrador", "descripcion": "Administrador del sistema", "permisos": ["all"]},
        {"nombre": "Docente", "descripcion": "Profesor del instituto", "permisos": ["read", "write"]},
        {"nombre": "Estudiante", "descripcion": "Estudiante del instituto", "permisos": ["read"]}
    ]
    
    for rol_data in roles_data:
        Rol.objects.get_or_create(
            nombre=rol_data["nombre"],
            defaults={
                "descripcion": rol_data["descripcion"],
                "permisos": rol_data["permisos"]
            }
        )
    print("Roles creados correctamente")

def init_admin():
    rol_admin = Rol.objects.get(nombre="Administrador")
    
    Usuario.objects.get_or_create(
        email="admin@profesort.com",
        defaults={
            "password": "Admin123456",
            "name": "Administrador",
            "id_rol": rol_admin,
            "legajo": "ADM001",
            "dni": "00000000",
            "fecha_nacimiento": datetime(1990, 1, 1).date(),
            "domicilio": "Dirección Admin",
            "telefono": "000000000",
            "fecha_ingreso": timezone.now(),
            "area": "Administración",
            "is_active": True
        }
    )
    print("Usuario admin creado correctamente")

if __name__ == '__main__':
    print("Inicializando datos...")
    init_roles()
    init_admin()
    print("Datos inicializados correctamente")
