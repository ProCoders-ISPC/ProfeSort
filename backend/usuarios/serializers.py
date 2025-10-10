from rest_framework import serializers
from .models import Usuario, Rol
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'  

class UsuarioSerializer(serializers.ModelSerializer):
    rol_nombre = serializers.CharField(source='id_rol.nombre', read_only=True)
    
    class Meta:
        model = Usuario
        fields = '__all__'  
        extra_kwargs = {
            'password': {'write_only': True},  
        }

 
    def create(self, validated_data):
        return Usuario.objects.create(**validated_data)

   
    def update(self, instance, validated_data):
       return super().update(instance, validated_data)

class DocenteUpdateSerializer(serializers.ModelSerializer):
    """Serializer específico para actualizar datos personales de docentes"""
    
    class Meta:
        model = Usuario
        fields = [
            'name', 'email', 'dni', 'fecha_nacimiento', 
            'domicilio', 'telefono', 'area', 'legajo'
        ]
        extra_kwargs = {
            'email': {'required': False},
            'name': {'required': False},
            'dni': {'required': False},
            'fecha_nacimiento': {'required': False},
            'domicilio': {'required': False},
            'telefono': {'required': False},
            'area': {'required': False},
            'legajo': {'required': False},
        }

    def validate_email(self, value):
        """Validar que el email sea único (excluyendo el usuario actual)"""
        if value:
            instance = getattr(self, 'instance', None)
            if instance and instance.email != value:
                if Usuario.objects.filter(email=value).exists():
                    raise serializers.ValidationError("Este email ya está en uso por otro usuario.")
        return value

    def validate_legajo(self, value):
        """Validar que el legajo sea único (excluyendo el usuario actual)"""
        if value:
            instance = getattr(self, 'instance', None)
            if instance and instance.legajo != value:
                if Usuario.objects.filter(legajo=value).exists():
                    raise serializers.ValidationError("Este legajo ya está en uso por otro usuario.")
        return value

    def validate_dni(self, value):
        """Validar formato del DNI"""
        if value:
            if not value.isdigit() or len(value) < 7 or len(value) > 8:
                raise serializers.ValidationError("El DNI debe tener entre 7 y 8 dígitos.")
        return value

    def validate_telefono(self, value):
        """Validar formato del teléfono"""
        if value:
            # Permitir formatos: +54 11 1234-5678, 11-1234-5678, 1112345678, etc.
            import re
            if not re.match(r'^[\+]?[0-9\s\-\(\)]{8,15}$', value):
                raise serializers.ValidationError("Formato de teléfono inválido.")
        return value

    def update(self, instance, validated_data):
        """Actualizar solo los campos proporcionados"""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance