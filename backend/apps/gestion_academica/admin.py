from django.contrib import admin
from .models import Materia, AsignacionDocenteMateria

@admin.register(Materia)
class MateriaAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'codigo', 'area', 'nivel']
    search_fields = ['nombre', 'codigo']
    list_filter = ['area', 'nivel']

@admin.register(AsignacionDocenteMateria)
class AsignacionDocenteMateriaAdmin(admin.ModelAdmin):
    list_display = ['id', 'id_usuario', 'id_materia', 'fecha_asignacion', 'estado']
    list_filter = ['id_materia', 'estado']
    search_fields = ['id_usuario__name', 'id_materia__nombre']
