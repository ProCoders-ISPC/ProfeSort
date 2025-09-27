from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Usuario, Rol
from .serializers import UsuarioSerializer, RolSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]  # Sin autenticación
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class RolViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]  # Sin autenticación  
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

