from rest_framework import serializers
from .models import Usuario, Rol

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = ['id', 'nombre', 'descripcion', 'permisos']

class UsuarioSerializer(serializers.ModelSerializer):
    rol = RolSerializer(source='id_rol', read_only=True)
    
    class Meta:
        model = Usuario
        fields = [
            'id', 'email', 'password', 'name', 'id_rol', 'rol',
            'legajo', 'dni', 'fecha_nacimiento', 'domicilio', 'telefono',
            'fecha_ingreso', 'area', 'is_active', 'created_at'
        ]
        extra_kwargs = {'password': {'write_only': True}}
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['id_rol'] = instance.id_rol.id
        return representation

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class RegisterSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=100)
    apellido = serializers.CharField(max_length=100, required=False, allow_blank=True)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6)
    dni = serializers.CharField(max_length=20)
    legajo = serializers.CharField(max_length=20)
    fechaNacimiento = serializers.DateField()
    domicilio = serializers.CharField(max_length=255)
    telefono = serializers.CharField(max_length=20)
    confirmarEmail = serializers.EmailField()
    confirmarPassword = serializers.CharField()
    terminos = serializers.BooleanField()
    
    def validate(self, data):
        if data['email'] != data['confirmarEmail']:
            raise serializers.ValidationError({"confirmarEmail": "Los emails no coinciden"})
        
        if data['password'] != data['confirmarPassword']:
            raise serializers.ValidationError({"confirmarPassword": "Las contraseñas no coinciden"})
        
        if not data['terminos']:
            raise serializers.ValidationError({"terminos": "Debe aceptar los términos y condiciones"})
        
        if Usuario.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Este email ya está registrado"})
        
        if Usuario.objects.filter(legajo=data['legajo']).exists():
            raise serializers.ValidationError({"legajo": "Este legajo ya está registrado"})
        
        return data
