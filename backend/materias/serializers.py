from rest_framework import serializers
from .models import Materia

class MateriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materia
        fields = ['id', 'nombre', 'codigo', 'descripcion', 'creditos', 'profesor']
        
    def validate_codigo(self, value):
        """
        Validar que el código de materia sea único
        """
        if self.instance:
            # Si estamos actualizando, excluir la instancia actual de la validación
            if Materia.objects.filter(codigo=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("Ya existe una materia con este código.")
        else:
            # Si estamos creando, verificar que no exista
            if Materia.objects.filter(codigo=value).exists():
                raise serializers.ValidationError("Ya existe una materia con este código.")
        return value