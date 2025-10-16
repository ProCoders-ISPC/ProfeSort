from rest_framework import serializers
from .models import Estudiante

class EstudianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudiante
        fields = ['id', 'nombre', 'apellidos', 'dni', 'email', 'estado', 'legajo', 'docenteId']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['docenteId'] = instance.docenteId.id if instance.docenteId else None
        return representation
