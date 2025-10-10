# Migración de Mock-API a Django Backend

## Cambios Realizados

### URLs Actualizadas

Todas las URLs del frontend han sido actualizadas de `http://localhost:3000` a `http://localhost:8000`

#### Archivos Modificados:

1. **`frontend/src/environments/environment.ts`**
   - Cambio: `apiUrl: 'http://localhost:3000'` → `apiUrl: 'http://localhost:8000'`

2. **`frontend/src/app/core/services/materias.service.ts`**
   - `http://localhost:3000/materias` → `http://localhost:8000/materias`
   - `http://localhost:3000/usuarios` → `http://localhost:8000/usuarios`

3. **`frontend/src/app/core/services/services.ts`**
   - `http://localhost:3000/auth` → `http://localhost:8000/usuarios`
   - Login endpoint: `/usuarios/login`

4. **`frontend/src/app/features/docente/perfil/perfil.ts`**
   - `http://localhost:3000/usuarios/{id}` → `http://localhost:8000/usuarios/{id}`

### Endpoints Disponibles en el Backend

#### Autenticación
- **POST** `/usuarios/login/`
  - Body: `{ "email": "admin@profesort.com", "password": "Admin123456" }`
  - Response: `{ "success": true, "data": {...usuario}, "message": "Login exitoso" }`

#### Usuarios
- **GET** `/usuarios/` - Listar todos los usuarios
- **GET** `/usuarios/?id_rol=2` - Filtrar usuarios por rol
- **POST** `/usuarios/` - Crear nuevo usuario
- **GET** `/usuarios/{id}/` - Detalle de usuario
- **PUT** `/usuarios/{id}/` - Actualizar usuario completo
- **PATCH** `/usuarios/{id}/` - Actualizar usuario parcialmente
- **DELETE** `/usuarios/{id}/` - Eliminar usuario

#### Roles
- **GET** `/usuarios/roles/` - Listar todos los roles

#### Materias
- **GET** `/materias/` - Listar todas las materias
- **POST** `/materias/` - Crear nueva materia
- **GET** `/materias/{id}/` - Detalle de materia
- **PUT** `/materias/{id}/` - Actualizar materia
- **PATCH** `/materias/{id}/` - Actualizar materia parcialmente
- **DELETE** `/materias/{id}/` - Eliminar materia

#### Asignaciones Docente-Materia
- **GET** `/asignaciones_docentes_materias/` - Listar asignaciones
- **POST** `/asignaciones_docentes_materias/` - Crear asignación
- **GET** `/asignaciones_docentes_materias/{id}/` - Detalle de asignación
- **PUT** `/asignaciones_docentes_materias/{id}/` - Actualizar asignación
- **DELETE** `/asignaciones_docentes_materias/{id}/` - Eliminar asignación

#### Estudiantes
- **GET** `/estudiantes/` - Listar todos los estudiantes
- **GET** `/estudiantes/?docenteId=2` - Filtrar estudiantes por docente
- **POST** `/estudiantes/` - Crear nuevo estudiante
- **GET** `/estudiantes/{id}/` - Detalle de estudiante
- **PUT** `/estudiantes/{id}/` - Actualizar estudiante
- **PATCH** `/estudiantes/{id}/` - Actualizar estudiante parcialmente
- **DELETE** `/estudiantes/{id}/` - Eliminar estudiante

### Formato de Respuestas

#### Respuestas Exitosas
```json
{
  "success": true,
  "data": { /* datos */ },
  "message": "Mensaje opcional"
}
```

#### Respuestas de Error
```json
{
  "success": false,
  "message": "Descripción del error",
  "error": { /* detalles del error */ }
}
```

### Diferencias con Mock-API

1. **Contraseñas**: Almacenadas en texto plano (solo para desarrollo)
2. **Login**: Endpoint cambió de `/auth/login` a `/usuarios/login`
3. **IDs de roles**: Formato de respuesta incluye objeto `rol` anidado
4. **Formato de respuesta**: Todas las respuestas incluyen `success`, `data`, `message`

### Credenciales de Prueba

**Administrador:**
- Email: `admin@profesort.com`
- Password: `Admin123456`

### Documentación de API

Accede a `http://localhost:8000/` para ver la documentación completa en formato JSON con ejemplos de uso.

### Panel de Administración Django

- URL: `http://localhost:8000/admin/`
- Usuario: `admin@profesort.com`
- Password: `Admin123456`

## Para Iniciar el Proyecto

### Backend (Django)
```bash
cd backend
venv\Scripts\activate  # Windows
python manage.py runserver
```

### Frontend (Angular)
```bash
cd frontend
ng serve
```

El frontend estará disponible en: `http://localhost:4200`
El backend estará disponible en: `http://localhost:8000`
