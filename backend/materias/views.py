from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Materia
from .serializers import MateriaSerializer
from profesortbackend.config import ERROR_MESSAGES, SUCCESS_MESSAGES

class MateriaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operaciones CRUD de Materias
    """
    queryset = Materia.objects.all()
    serializer_class = MateriaSerializer
    
    def list(self, request):
        """
        Listar todas las materias
        """
        try:
            materias = self.get_queryset()
            serializer = self.get_serializer(materias, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': ERROR_MESSAGES['SERVER_ERROR']}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def create(self, request):
        """
        Crear una nueva materia
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            response_data = serializer.data
            response_data['message'] = SUCCESS_MESSAGES['CREATED']
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(
            {'error': ERROR_MESSAGES['VALIDATION_ERROR'], 'details': serializer.errors}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    def retrieve(self, request, pk=None):
        """
        Obtener una materia específica
        """
        try:
            materia = self.get_object()
            serializer = self.get_serializer(materia)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Materia.DoesNotExist:
            return Response(
                {'error': ERROR_MESSAGES['NOT_FOUND']}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    def update(self, request, pk=None):
        """
        Actualizar una materia
        """
        try:
            materia = self.get_object()
            serializer = self.get_serializer(materia, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                response_data = serializer.data
                response_data['message'] = SUCCESS_MESSAGES['UPDATED']
                return Response(response_data, status=status.HTTP_200_OK)
            return Response(
                {'error': ERROR_MESSAGES['VALIDATION_ERROR'], 'details': serializer.errors}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Materia.DoesNotExist:
            return Response(
                {'error': ERROR_MESSAGES['NOT_FOUND']}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    def destroy(self, request, pk=None):
        """
        Eliminar una materia
        """
        try:
            materia = self.get_object()
            materia.delete()
            return Response(
                {'message': SUCCESS_MESSAGES['DELETED']}, 
                status=status.HTTP_200_OK
            )
        except Materia.DoesNotExist:
            return Response(
                {'error': ERROR_MESSAGES['NOT_FOUND']}, 
                status=status.HTTP_404_NOT_FOUND
            )
