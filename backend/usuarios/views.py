from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Usuario, Rol
from .serializers import UsuarioSerializer, RolSerializer
from django.db.models import Q

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
    
    def get_queryset(self):
        """Filtrar docentes por término de búsqueda, estado y area"""
        queryset = Usuario.objects.filter(role__id=2)  # Solo usuarios con rol docente
        
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
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Endpoint para estadísticas de docentes"""
        total_docentes = self.get_queryset().count()
        return Response({
            'totalDocentes': total_docentes
        })

