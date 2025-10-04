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

class RolViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]  # Sin autenticación  
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

# Añadir nuevo ViewSet para docentes
class DocenteViewSet(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    
    def get_queryset(self):
        # Filtrar solo usuarios con rol de docente (asumiendo que role_id=2 son docentes)
        queryset = Usuario.objects.filter(role_id=2)
        
        # Filtrado por búsqueda
        termino = self.request.query_params.get('termino')
        if termino:
            queryset = queryset.filter(
                Q(name__icontains=termino) | 
                Q(email__icontains=termino) | 
                Q(legajo__icontains=termino)
            )
        
        # Filtrado por estado
        estado = self.request.query_params.get('estado')
        if estado:
            queryset = queryset.filter(estado=estado)
            
        # Filtrado por departamento
        departamento = self.request.query_params.get('departamento')
        if departamento:
            queryset = queryset.filter(departamento=departamento)
            
        return queryset
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Endpoint para estadísticas de docentes"""
        total_docentes = self.get_queryset().count()
        return Response({
            'totalDocentes': total_docentes
        })

