from django.contrib import admin
from .models import Usuario, Rol

@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'descripcion']
    search_fields = ['nombre']

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['id', 'email', 'name', 'id_rol', 'legajo', 'is_active']
    list_filter = ['id_rol', 'is_active', 'area']
    search_fields = ['email', 'name', 'legajo', 'dni']
