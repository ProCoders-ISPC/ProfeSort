import os
import django


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.usuarios.models import Usuario


email = 'cristianvargas@gmail.com'

try:
    usuario = Usuario.objects.get(email=email)
    print(f'Usuario encontrado: {usuario.name}')
    print(f'Email: {usuario.email}')
    print(f'Estado actual (is_active): {usuario.is_active}')
    
    if not usuario.is_active:
        usuario.is_active = True
        usuario.save()
        print('✅ Usuario activado exitosamente')
    else:
        print('ℹ️ El usuario ya estaba activo')
        
  
    print(f'\nEstado final:')
    print(f'- Nombre: {usuario.name}')
    print(f'- Email: {usuario.email}')
    print(f'- Activo: {usuario.is_active}')
    print(f'- Rol: {usuario.id_rol.nombre if usuario.id_rol else "Sin rol"}')
    
except Usuario.DoesNotExist:
    print(f'❌ No se encontró usuario con email: {email}')
except Exception as e:
    print(f'❌ Error: {e}')
