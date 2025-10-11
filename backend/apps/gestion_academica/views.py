from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404
from apps.core.responses import success_response, error_response
from .models import Materia, AsignacionDocenteMateria
from .serializers import MateriaSerializer, AsignacionDocenteMateriaSerializer

class MateriaListCreateView(APIView):
    def get(self, request):
        materias = Materia.objects.all()
        serializer = MateriaSerializer(materias, many=True)
        return success_response(data=serializer.data)
    
    def post(self, request):
        serializer = MateriaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return success_response(data=serializer.data, status_code=status.HTTP_201_CREATED)
        return error_response(error=serializer.errors, message="Error al crear materia", status_code=status.HTTP_400_BAD_REQUEST)

class MateriaDetailView(APIView):
    def get(self, request, pk):
        materia = get_object_or_404(Materia, pk=pk)
        serializer = MateriaSerializer(materia)
        return success_response(data=serializer.data)
    
    def put(self, request, pk):
        materia = get_object_or_404(Materia, pk=pk)
        serializer = MateriaSerializer(materia, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return success_response(data=serializer.data)
        return error_response(error=serializer.errors, message="Error al actualizar materia", status_code=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        materia = get_object_or_404(Materia, pk=pk)
        serializer = MateriaSerializer(materia, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return success_response(data=serializer.data)
        return error_response(error=serializer.errors, message="Error al actualizar materia", status_code=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        materia = get_object_or_404(Materia, pk=pk)
        materia.delete()
        return success_response(message="Materia eliminada correctamente", status_code=status.HTTP_204_NO_CONTENT)

class AsignacionDocenteMateriaListCreateView(APIView):
    def get(self, request):
        # Obtener parámetros de filtrado
        id_materia = request.GET.get('id_materia')
        id_usuario = request.GET.get('id_usuario')
        
        # Filtrar asignaciones según parámetros
        asignaciones = AsignacionDocenteMateria.objects.all()
        
        if id_materia:
            asignaciones = asignaciones.filter(id_materia=id_materia)
        
        if id_usuario:
            asignaciones = asignaciones.filter(id_usuario=id_usuario)
        
        serializer = AsignacionDocenteMateriaSerializer(asignaciones, many=True)
        return success_response(data=serializer.data)
    
    def post(self, request):
        print("DATOS RECIBIDOS:", request.data)
        serializer = AsignacionDocenteMateriaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return success_response(data=serializer.data, status_code=status.HTTP_201_CREATED)
        print("ERRORES SERIALIZER:", serializer.errors)
        return error_response(error=serializer.errors, message="Error al crear asignación", status_code=status.HTTP_400_BAD_REQUEST)

class AsignacionDocenteMateriaDetailView(APIView):
    def get(self, request, pk):
        asignacion = get_object_or_404(AsignacionDocenteMateria, pk=pk)
        serializer = AsignacionDocenteMateriaSerializer(asignacion)
        return success_response(data=serializer.data)
    
    def put(self, request, pk):
        asignacion = get_object_or_404(AsignacionDocenteMateria, pk=pk)
        serializer = AsignacionDocenteMateriaSerializer(asignacion, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return success_response(data=serializer.data)
        return error_response(error=serializer.errors, message="Error al actualizar asignación", status_code=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        asignacion = get_object_or_404(AsignacionDocenteMateria, pk=pk)
        serializer = AsignacionDocenteMateriaSerializer(asignacion, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return success_response(data=serializer.data)
        return error_response(error=serializer.errors, message="Error al actualizar asignación", status_code=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        asignacion = get_object_or_404(AsignacionDocenteMateria, pk=pk)
        asignacion.delete()
        return success_response(message="Asignación eliminada correctamente", status_code=status.HTTP_204_NO_CONTENT)
