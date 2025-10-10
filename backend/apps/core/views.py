from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class APIRootView(APIView):
    def get(self, request):
        api_info = {
            "message": "Bienvenido a ProfeSort API",
            "version": "1.0.0",
            "descripcion": "API REST para el sistema de gestión académica ProfeSort",
            "endpoints": {
                "autenticacion": {
                    "login": {
                        "url": "/usuarios/login/",
                        "metodo": "POST",
                        "descripcion": "Iniciar sesión",
                        "body": {
                            "email": "admin@profesort.com",
                            "password": "Admin123456"
                        }
                    }
                },
                "usuarios": {
                    "listar_roles": {
                        "url": "/usuarios/roles/",
                        "metodo": "GET",
                        "descripcion": "Listar todos los roles"
                    },
                    "listar_usuarios": {
                        "url": "/usuarios/",
                        "metodo": "GET",
                        "descripcion": "Listar todos los usuarios",
                        "query_params": "?id_rol=2 (opcional, filtrar por rol)"
                    },
                    "crear_usuario": {
                        "url": "/usuarios/",
                        "metodo": "POST",
                        "descripcion": "Crear nuevo usuario"
                    },
                    "detalle_usuario": {
                        "url": "/usuarios/{id}/",
                        "metodos": ["GET", "PUT", "PATCH", "DELETE"],
                        "descripcion": "Ver, actualizar o eliminar usuario"
                    }
                },
                "materias": {
                    "listar_materias": {
                        "url": "/materias/",
                        "metodo": "GET",
                        "descripcion": "Listar todas las materias"
                    },
                    "crear_materia": {
                        "url": "/materias/",
                        "metodo": "POST",
                        "descripcion": "Crear nueva materia",
                        "body": {
                            "nombre": "Matemáticas",
                            "anio": 1,
                            "descripcion": "Descripción de la materia"
                        }
                    },
                    "detalle_materia": {
                        "url": "/materias/{id}/",
                        "metodos": ["GET", "PUT", "PATCH", "DELETE"],
                        "descripcion": "Ver, actualizar o eliminar materia"
                    }
                },
                "asignaciones": {
                    "listar_asignaciones": {
                        "url": "/asignaciones_docentes_materias/",
                        "metodo": "GET",
                        "descripcion": "Listar asignaciones docente-materia"
                    },
                    "crear_asignacion": {
                        "url": "/asignaciones_docentes_materias/",
                        "metodo": "POST",
                        "descripcion": "Asignar docente a materia",
                        "body": {
                            "docenteId": 1,
                            "materiaId": 1
                        }
                    },
                    "detalle_asignacion": {
                        "url": "/asignaciones_docentes_materias/{id}/",
                        "metodos": ["GET", "PUT", "DELETE"],
                        "descripcion": "Ver, actualizar o eliminar asignación"
                    }
                },
                "estudiantes": {
                    "listar_estudiantes": {
                        "url": "/estudiantes/",
                        "metodo": "GET",
                        "descripcion": "Listar todos los estudiantes",
                        "query_params": "?docenteId=2 (opcional, filtrar por docente)"
                    },
                    "crear_estudiante": {
                        "url": "/estudiantes/",
                        "metodo": "POST",
                        "descripcion": "Crear nuevo estudiante",
                        "body": {
                            "nombre": "Juan",
                            "apellidos": "Pérez",
                            "dni": "12345678",
                            "email": "juan@example.com",
                            "estado": "Activo",
                            "legajo": "EST001",
                            "docenteId": 2
                        }
                    },
                    "detalle_estudiante": {
                        "url": "/estudiantes/{id}/",
                        "metodos": ["GET", "PUT", "PATCH", "DELETE"],
                        "descripcion": "Ver, actualizar o eliminar estudiante"
                    }
                },
                "admin": {
                    "panel_administracion": {
                        "url": "/admin/",
                        "metodo": "GET",
                        "descripcion": "Panel de administración de Django"
                    }
                }
            },
            "credenciales_admin": {
                "email": "admin@profesort.com",
                "password": "Admin123456"
            },
            "notas": [
                "Todas las respuestas exitosas incluyen: {success: true, data: {...}}",
                "Todas las respuestas de error incluyen: {success: false, message: '...', error: {...}}",
                "Las contraseñas se almacenan en texto plano (solo desarrollo)",
                "CORS habilitado para localhost:4200"
            ]
        }
        return Response(api_info, status=status.HTTP_200_OK)
