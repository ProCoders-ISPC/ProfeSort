from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404
from apps.core.responses import success_response, error_response
from .models import Estudiante
from .serializers import EstudianteSerializer

class EstudianteListCreateView(APIView):
    def get(self, request):
        return success_response(data=[], message="Módulo de estudiantes desactivado temporalmente")
    
    def post(self, request):
        serializer = EstudianteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return success_response(data=serializer.data, status_code=status.HTTP_201_CREATED)
        return error_response(error=serializer.errors, message="Error al crear estudiante", status_code=status.HTTP_400_BAD_REQUEST)

class EstudianteDetailView(APIView):
    def get(self, request, pk):
        return error_response(error="Estudiante no encontrado", message="Módulo de estudiantes desactivado temporalmente", status_code=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk):
        return error_response(error="Operación no disponible", message="Módulo de estudiantes desactivado temporalmente", status_code=status.HTTP_404_NOT_FOUND)
    
    def patch(self, request, pk):
        return error_response(error="Operación no disponible", message="Módulo de estudiantes desactivado temporalmente", status_code=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        estudiante = get_object_or_404(Estudiante, pk=pk)
        estudiante.delete()
        return success_response(message="Estudiante eliminado correctamente", status_code=status.HTTP_204_NO_CONTENT)
