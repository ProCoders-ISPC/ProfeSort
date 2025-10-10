from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Usuario, Rol
from .serializers import UsuarioSerializer, RolSerializer, DocenteUpdateSerializer
from django.db.models import Q
from django.db import transaction
from rest_framework.exceptions import ValidationError

class UsuarioViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]  # Sin autenticación
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    
    def partial_update(self, request, *args, **kwargs):
        """Permite actualización parcial (PATCH) para cambios de rol"""
        print("PATCH recibido:", request.data)
        return super().partial_update(request, *args, **kwargs)

class RolViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]  # Sin autenticación  
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

# Añadir nuevo ViewSet para docentes
class DocenteViewSet(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Filtrar docentes por término de búsqueda, estado y area"""
        queryset = Usuario.objects.filter(id_rol__id=2)  # Solo usuarios con rol docente
        
        # Filtros opcionales
        termino = self.request.query_params.get('termino', None)
        estado = self.request.query_params.get('estado', None)
        area = self.request.query_params.get('area', None)
        
        if termino:
            queryset = queryset.filter(
                Q(name__icontains=termino) | 
                Q(email__icontains=termino) |
                Q(legajo__icontains=termino)
            )
            
        if estado:
            queryset = queryset.filter(is_active=(estado.lower() == 'activo'))
            
        if area:
            queryset = queryset.filter(area=area)

        return queryset
    
    def update(self, request, *args, **kwargs):
        """
        Actualizar datos personales de un docente existente
        PUT /docente/{id}
        """
        try:
            # Obtener el ID del docente desde la URL
            docente_id = kwargs.get('pk')
            
            # Buscar el docente por ID
            try:
                docente = Usuario.objects.get(pk=docente_id, id_rol__id=2)
            except Usuario.DoesNotExist:
                return Response(
                    {
                        'error': 'Docente no encontrado',
                        'message': f'No existe un docente con ID {docente_id}'
                    },
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Usar el serializer específico para actualización de docentes
            serializer = DocenteUpdateSerializer(
                docente, 
                data=request.data, 
                partial=True  # Permite actualización parcial
            )
            
            if serializer.is_valid():
                # Usar transacción para asegurar consistencia
                with transaction.atomic():
                    updated_docente = serializer.save()
                    
                    # Responder con el docente actualizado usando el serializer completo
                    response_serializer = UsuarioSerializer(updated_docente)
                    return Response(
                        {
                            'message': 'Docente actualizado exitosamente',
                            'docente': response_serializer.data
                        },
                        status=status.HTTP_200_OK
                    )
            else:
                return Response(
                    {
                        'error': 'Datos inválidos',
                        'details': serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            return Response(
                {
                    'error': 'Error interno del servidor',
                    'message': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def partial_update(self, request, *args, **kwargs):
        """
        Actualización parcial de un docente
        PATCH /docente/{id}
        """
        # Reutilizar la lógica del método update
        return self.update(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Endpoint para estadísticas de docentes"""
        total_docentes = self.get_queryset().count()
        return Response({
            'totalDocentes': total_docentes
        })

    @action(detail=True, methods=['put', 'patch'])
    def actualizar_datos_personales(self, request, pk=None):
        """
        Endpoint específico para actualizar solo datos personales
        PUT/PATCH /docente/{id}/actualizar_datos_personales/
        """
        try:
            docente = get_object_or_404(Usuario, pk=pk, id_rol__id=2)
            
            # Campos permitidos para actualización de datos personales
            campos_permitidos = [
                'name', 'email', 'dni', 'fecha_nacimiento', 
                'domicilio', 'telefono', 'area'
            ]
            
            # Filtrar solo los campos permitidos del request
            datos_filtrados = {
                key: value for key, value in request.data.items() 
                if key in campos_permitidos
            }
            
            serializer = DocenteUpdateSerializer(
                docente, 
                data=datos_filtrados, 
                partial=True
            )
            
            if serializer.is_valid():
                with transaction.atomic():
                    updated_docente = serializer.save()
                    response_serializer = UsuarioSerializer(updated_docente)
                    
                    return Response(
                        {
                            'message': 'Datos personales actualizados exitosamente',
                            'docente': response_serializer.data,
                            'campos_actualizados': list(datos_filtrados.keys())
                        },
                        status=status.HTTP_200_OK
                    )
            else:
                return Response(
                    {
                        'error': 'Datos inválidos',
                        'details': serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            return Response(
                {
                    'error': 'Error interno del servidor',
                    'message': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

