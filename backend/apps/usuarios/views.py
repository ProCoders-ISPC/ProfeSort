from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from apps.core.responses import success_response, error_response
from .models import Usuario, Rol
from .serializers import UsuarioSerializer, RolSerializer, LoginSerializer, RegisterSerializer

class RolListView(APIView):
    def get(self, request):
        roles = Rol.objects.all()
        serializer = RolSerializer(roles, many=True)
        return success_response(data=serializer.data)

class UsuarioListCreateView(APIView):
    def get(self, request):
        id_rol = request.query_params.get('id_rol')
        if id_rol:
            usuarios = Usuario.objects.filter(id_rol=id_rol)
        else:
            usuarios = Usuario.objects.all()
        serializer = UsuarioSerializer(usuarios, many=True)
        return success_response(data=serializer.data)
    
    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return success_response(data=serializer.data, status_code=status.HTTP_201_CREATED)
        return error_response(error=serializer.errors, message="Error al crear usuario", status_code=status.HTTP_400_BAD_REQUEST)

class UsuarioDetailView(APIView):
    def get(self, request, pk):
        usuario = get_object_or_404(Usuario, pk=pk)
        serializer = UsuarioSerializer(usuario)
        return success_response(data=serializer.data)
    
    def put(self, request, pk):
        usuario = get_object_or_404(Usuario, pk=pk)
        serializer = UsuarioSerializer(usuario, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return success_response(data=serializer.data)
        return error_response(error=serializer.errors, message="Error al actualizar usuario", status_code=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        usuario = get_object_or_404(Usuario, pk=pk)
        serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return success_response(data=serializer.data)
        return error_response(error=serializer.errors, message="Error al actualizar usuario", status_code=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        usuario = get_object_or_404(Usuario, pk=pk)
        usuario.delete()
        return success_response(message="Usuario eliminado correctamente", status_code=status.HTTP_204_NO_CONTENT)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(error=serializer.errors, message="Datos inválidos", status_code=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            usuario = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            return error_response(error="Usuario no registrado", message="Usuario no registrado en ProfeSort", status_code=status.HTTP_401_UNAUTHORIZED)
        
        if usuario.password != password:
            return error_response(error="Contraseña incorrecta", message="Contraseña incorrecta", status_code=status.HTTP_400_BAD_REQUEST)
        
        if not usuario.is_active:
            return error_response(error="Cuenta desactivada", message="Usuario inactivo", status_code=status.HTTP_403_FORBIDDEN)
        
        usuario_data = UsuarioSerializer(usuario).data
        return success_response(data=usuario_data, message="Login exitoso")

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(error=serializer.errors, message="Error en los datos de registro", status_code=status.HTTP_400_BAD_REQUEST)
        
        try:
            rol_docente = Rol.objects.get(nombre='Docente')
        except Rol.DoesNotExist:
            return error_response(error="Rol no encontrado", message="Error de configuración del sistema", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        nombre_completo = serializer.validated_data['nombre']
        if serializer.validated_data.get('apellido'):
            nombre_completo += f" {serializer.validated_data['apellido']}"
        
        usuario = Usuario.objects.create(
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password'],
            name=nombre_completo,
            id_rol=rol_docente,
            legajo=serializer.validated_data['legajo'],
            dni=serializer.validated_data['dni'],
            fecha_nacimiento=serializer.validated_data['fechaNacimiento'],
            domicilio=serializer.validated_data['domicilio'],
            telefono=serializer.validated_data['telefono'],
            fecha_ingreso=timezone.now(),
            area='Sin asignar',
            is_active=True
        )
        
        usuario_data = UsuarioSerializer(usuario).data
        return success_response(data=usuario_data, message="Usuario registrado exitosamente", status_code=status.HTTP_201_CREATED)

class ValidateSessionView(APIView):
    def get(self, request, pk):
        try:
            usuario = Usuario.objects.get(pk=pk)
            if usuario.is_active:
                usuario_data = UsuarioSerializer(usuario).data
                return success_response(data=usuario_data, message="Sesión válida")
            else:
                return error_response(error="Usuario inactivo", message="Usuario inactivo", status_code=status.HTTP_403_FORBIDDEN)
        except Usuario.DoesNotExist:
            return error_response(error="Usuario no encontrado", message="Sesión inválida", status_code=status.HTTP_404_NOT_FOUND)
