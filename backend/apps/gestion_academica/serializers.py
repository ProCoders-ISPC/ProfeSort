from rest_framework import serializers
from .models import Materia, AsignacionDocenteMateria
from apps.usuarios.models import Usuario

class MateriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materia
        fields = ['id', 'nombre', 'codigo', 'horas_semanales', 'area', 'nivel', 'descripcion']

class AsignacionDocenteMateriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AsignacionDocenteMateria
        fields = ['id', 'id_usuario', 'id_materia', 'id_rol', 'fecha_asignacion', 'estado']
        read_only_fields = ['fecha_asignacion']
