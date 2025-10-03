"""
Configuración de la aplicación
"""
import os
from django.core.exceptions import ImproperlyConfigured

def get_env_variable(var_name, default=None):
    """Obtener variable de entorno o valor por defecto"""
    try:
        return os.environ[var_name]
    except KeyError:
        if default is not None:
            return default
        error_msg = f"Establece la variable de entorno {var_name}"
        raise ImproperlyConfigured(error_msg)

# URLs de frontend permitidas para CORS
FRONTEND_URLS = [
    get_env_variable('FRONTEND_URL_LOCAL', 'http://localhost:4200'),
    get_env_variable('FRONTEND_URL_LOCAL_ALT', 'http://127.0.0.1:4200'),
    get_env_variable('FRONTEND_URL_PROD', 'https://profesort.com'),
]

# Configuración de base de datos
DATABASE_CONFIG = {
    'ENGINE': 'django.db.backends.postgresql',
    'NAME': get_env_variable('DB_NAME', 'profesort_db'),
    'USER': get_env_variable('DB_USER', 'profesort_db_admin'),
    'PASSWORD': get_env_variable('DB_PASSWORD', 'admin123'),
    'HOST': get_env_variable('DB_HOST', 'localhost'),
    'PORT': get_env_variable('DB_PORT', '5432'),
}

# Configuración de paginación
PAGINATION_SIZE = int(get_env_variable('PAGINATION_SIZE', '10'))

# Configuración de autenticación
AUTH_CONFIG = {
    'TOKEN_EXPIRY_HOURS': int(get_env_variable('TOKEN_EXPIRY_HOURS', '24')),
    'PASSWORD_MIN_LENGTH': int(get_env_variable('PASSWORD_MIN_LENGTH', '8')),
}

# Mensajes de error estándar
ERROR_MESSAGES = {
    'NOT_FOUND': 'Recurso no encontrado',
    'VALIDATION_ERROR': 'Error de validación',
    'SERVER_ERROR': 'Error interno del servidor',
    'UNAUTHORIZED': 'No autorizado',
    'FORBIDDEN': 'Acceso denegado',
}

# Mensajes de éxito
SUCCESS_MESSAGES = {
    'CREATED': 'Recurso creado exitosamente',
    'UPDATED': 'Recurso actualizado exitosamente',
    'DELETED': 'Recurso eliminado exitosamente',
}