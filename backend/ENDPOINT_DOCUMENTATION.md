# Endpoint PUT /api/docentes/{id} - Documentación Completa

## Resumen
Este endpoint permite actualizar los datos personales de un docente existente usando los métodos HTTP PUT y PATCH.

## URL y Métodos
- **URL**: `/api/docentes/{id}/`
- **Métodos soportados**: `PUT`, `PATCH`
- **Autenticación**: Ninguna (configurado con `AllowAny`)

## Parámetros de URL
- `id` (int): ID único del docente a actualizar

## Campos Actualizables
Los siguientes campos pueden ser actualizados:

| Campo | Tipo | Requerido | Descripción | Validaciones |
|-------|------|-----------|-------------|--------------|
| `name` | string | No | Nombre completo del docente | Máximo 255 caracteres |
| `email` | string | No | Email del docente | Formato email válido, único |
| `dni` | string | No | Documento Nacional de Identidad | 7-8 dígitos numéricos |
| `fecha_nacimiento` | date | No | Fecha de nacimiento | Formato: YYYY-MM-DD |
| `domicilio` | string | No | Dirección del domicilio | Máximo 255 caracteres |
| `telefono` | string | No | Número de teléfono | Formato: +54 11 1234-5678 o similar |
| `area` | string | No | Área de trabajo/especialidad | Máximo 255 caracteres |
| `legajo` | string | No | Legajo del docente | Único, máximo 50 caracteres |

## Ejemplos de Uso

### 1. Actualización completa (PUT)
```bash
curl -X PUT http://localhost:8000/api/docentes/1/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Carlos Pérez",
    "email": "juan.perez@universidad.edu",
    "telefono": "11-1234-5678",
    "domicilio": "Av. Corrientes 1234, CABA",
    "area": "Sistemas",
    "dni": "12345678"
  }'
```

### 2. Actualización parcial (PATCH)
```bash
curl -X PATCH http://localhost:8000/api/docentes/1/ \
  -H "Content-Type: application/json" \
  -d '{
    "telefono": "11-9876-5432",
    "area": "Ingeniería de Software"
  }'
```

## Respuestas del Endpoint

### Éxito (HTTP 200)
```json
{
  "message": "Docente actualizado exitosamente",
  "docente": {
    "id": 1,
    "name": "Juan Carlos Pérez",
    "email": "juan.perez@universidad.edu",
    "dni": "12345678",
    "fecha_nacimiento": "1980-05-15",
    "domicilio": "Av. Corrientes 1234, CABA",
    "telefono": "11-1234-5678",
    "fecha_ingreso": "2020-03-01",
    "area": "Sistemas",
    "legajo": "DOC001",
    "is_active": true,
    "created_at": "2023-01-15T10:30:00Z",
    "role": 2,
    "rol_nombre": "Docente"
  }
}
```

### Docente no encontrado (HTTP 404)
```json
{
  "error": "Docente no encontrado",
  "message": "No existe un docente con ID 9999"
}
```

### Datos inválidos (HTTP 400)
```json
{
  "error": "Datos inválidos",
  "details": {
    "email": ["Este email ya está en uso por otro usuario."],
    "dni": ["El DNI debe tener entre 7 y 8 dígitos."],
    "telefono": ["Formato de teléfono inválido."]
  }
}
```

### Error interno del servidor (HTTP 500)
```json
{
  "error": "Error interno del servidor",
  "message": "Descripción del error específico"
}
```

## Validaciones Implementadas

### Email
- Formato de email válido
- Único en toda la base de datos (excluyendo el usuario actual)

### DNI
- Solo dígitos numéricos
- Entre 7 y 8 caracteres de longitud

### Teléfono
- Formato flexible: acepta números, espacios, guiones, paréntesis
- Entre 8 y 15 caracteres
- Ejemplos válidos: `+54 11 1234-5678`, `11-1234-5678`, `1112345678`

### Legajo
- Único en toda la base de datos (excluyendo el usuario actual)
- Máximo 50 caracteres

## Funcionalidades Especiales

### Transacciones Atómicas
El endpoint usa transacciones de base de datos para asegurar la consistencia de los datos.

### Actualización Parcial
Tanto PUT como PATCH soportan actualización parcial - solo los campos enviados en el request serán actualizados.

### Filtrado por Rol
Solo usuarios con rol de "Docente" (role_id = 2) pueden ser actualizados a través de este endpoint.

## Endpoint Adicional

### Actualización de Datos Personales Específica
**URL**: `/api/docentes/{id}/actualizar_datos_personales/`
**Métodos**: `PUT`, `PATCH`

Este endpoint es más restrictivo y solo permite actualizar campos de datos personales, excluyendo campos como `legajo`.

## Estructura del Código

### Archivos Modificados

1. **`usuarios/serializers.py`**
   - Agregado `DocenteUpdateSerializer` con validaciones específicas

2. **`usuarios/views.py`**
   - Actualizado `DocenteViewSet` con métodos `update()` y `partial_update()`
   - Agregado endpoint adicional `actualizar_datos_personales()`

3. **`usuarios/urls.py`**
   - Las rutas se generan automáticamente a través del router de DRF

## Cómo Probar el Endpoint

### 1. Iniciar el servidor Django
```bash
cd backend
python manage.py runserver
```

### 2. Crear un docente de prueba (si no existe)
```bash
curl -X POST http://localhost:8000/api/docentes/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Docente de Prueba",
    "email": "docente.prueba@universidad.edu",
    "password": "password123",
    "role": 2
  }'
```

### 3. Probar la actualización
```bash
curl -X PUT http://localhost:8000/api/docentes/1/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nombre Actualizado",
    "telefono": "11-5555-5555"
  }'
```

## Manejo de Errores

El endpoint maneja los siguientes tipos de errores:

1. **Docente no encontrado**: Verifica que el ID existe y corresponde a un docente
2. **Validación de datos**: Valida formato y unicidad de campos
3. **Errores de base de datos**: Manejo de excepciones de la base de datos
4. **Errores inesperados**: Captura y maneja cualquier otra excepción

## Consideraciones de Seguridad

- **Validación de entrada**: Todos los datos son validados antes de guardar
- **Transacciones atómicas**: Previene corrupción de datos
- **Unicidad**: Previene duplicación de emails y legajos
- **Filtrado por rol**: Solo docentes pueden ser actualizados

## Performance

- Usa `select_related` para optimizar consultas cuando sea necesario
- Transacciones atómicas minimizan el tiempo de bloqueo de la base de datos
- Validaciones eficientes que no requieren múltiples consultas a la base de datos