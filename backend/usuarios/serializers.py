from rest_framework import serializers
from .models import Usuario, Rol

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'  

class UsuarioSerializer(serializers.ModelSerializer):
    rol_nombre = serializers.CharField(source='role.nombre', read_only=True)
    
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