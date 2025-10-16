# ProfeSort Backend - Django REST Framework

Backend para el sistema ProfeSort desarrollado con Django REST Framework.

## Estructura del Proyecto

```
backend/
├── config/                 # Configuración principal de Django
├── apps/
│   ├── core/              # Utilidades compartidas
│   ├── usuarios/          # Usuarios y roles
│   ├── gestion_academica/ # Materias y asignaciones docentes
│   └── estudiantes/       # Gestión de estudiantes
└── init_data.py           # Script de inicialización
```

## Instalación

1. Crear y activar entorno virtual:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Configurar variables de entorno en archivo `.env`:
```
DB_NAME=profesort_db
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=tu_secret_key
DEBUG=True
```

4. Crear base de datos PostgreSQL:
```sql
CREATE DATABASE profesort_db;
```

5. Ejecutar migraciones:
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Inicializar datos (roles y usuario admin):
```bash
python init_data.py
```

## Ejecutar servidor

```bash
python manage.py runserver
```

El servidor estará disponible en `http://localhost:8000`

## Usuario Administrador

- Email: admin@profesort.com
- Password: Admin123456

## Endpoints Disponibles

### Usuarios y Roles
- GET `/usuarios/roles/` - Listar roles
- GET `/usuarios/` - Listar usuarios
- POST `/usuarios/` - Crear usuario
- GET `/usuarios/{id}/` - Detalle de usuario
- PUT/PATCH `/usuarios/{id}/` - Actualizar usuario
- DELETE `/usuarios/{id}/` - Eliminar usuario
- POST `/usuarios/login/` - Login

### Materias
- GET `/materias/` - Listar materias
- POST `/materias/` - Crear materia
- GET `/materias/{id}/` - Detalle de materia
- PUT/PATCH `/materias/{id}/` - Actualizar materia
- DELETE `/materias/{id}/` - Eliminar materia

### Asignaciones Docente-Materia
- GET `/asignaciones_docentes_materias/` - Listar asignaciones
- POST `/asignaciones_docentes_materias/` - Crear asignación
- GET `/asignaciones_docentes_materias/{id}/` - Detalle de asignación
- PUT/PATCH `/asignaciones_docentes_materias/{id}/` - Actualizar asignación
- DELETE `/asignaciones_docentes_materias/{id}/` - Eliminar asignación

### Estudiantes
- GET `/estudiantes/` - Listar estudiantes
- POST `/estudiantes/` - Crear estudiante
- GET `/estudiantes/{id}/` - Detalle de estudiante
- PUT/PATCH `/estudiantes/{id}/` - Actualizar estudiante
- DELETE `/estudiantes/{id}/` - Eliminar estudiante

## Tecnologías

- Django 5.0.1
- Django REST Framework 3.14.0
- PostgreSQL
- django-cors-headers 4.3.1
- psycopg2-binary 2.9.9
- python-dotenv 1.0.0
