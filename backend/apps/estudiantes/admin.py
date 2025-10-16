from django.contrib import admin
from .models import Estudiante

@admin.register(Estudiante)
class EstudianteAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'apellidos', 'legajo', 'email', 'estado', 'docenteId']
    list_filter = ['estado', 'docenteId']
    search_fields = ['nombre', 'apellidos', 'legajo', 'dni', 'email']
