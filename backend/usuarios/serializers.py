from rest_framework import serializers
from .models import Usuario, Rol

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'  # Incluye todos los campos del modelo
        # O especificar campos: fields = ['id_rol', 'nombre', 'descripcion', 'permisos']

class UsuarioSerializer(serializers.ModelSerializer):
    # Incluir información del rol relacionado (solo lectura)
    rol_nombre = serializers.CharField(source='role.nombre', read_only=True)
    
    class Meta:
        model = Usuario
        fields = '__all__'  # Todos los campos del modelo Usuario
        # O especificar: fields = ['id_usuario', 'email', 'name', 'role', 'legajo', 'dni', ...]
        
        # Campos adicionales calculados
        extra_kwargs = {
            'password': {'write_only': True},  # Password no se devuelve en GET
        }

    # Método para crear usuario (si necesitas lógica especial)
    def create(self, validated_data):
        # Aquí puedes agregar lógica de validación o encriptación
        return Usuario.objects.create(**validated_data)

    # Método para actualizar usuario
    def update(self, instance, validated_data):
        # Lógica personalizada de actualización si es necesario
        return super().update(instance, validated_data)