from django.db import models

class Rol(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField()
    permisos = models.JSONField(default=list)
    
    class Meta:
        db_table = 'roles'
        ordering = ['id']
    
    def __str__(self):
        return self.nombre

class Usuario(models.Model):
    email = models.EmailField(unique=True, max_length=255)
    password = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    id_rol = models.ForeignKey(Rol, on_delete=models.PROTECT, db_column='id_rol', related_name='usuarios')
    legajo = models.CharField(max_length=50, unique=True, null=True, blank=True)
    dni = models.CharField(max_length=20)
    fecha_nacimiento = models.DateField()
    domicilio = models.CharField(max_length=255)
    telefono = models.CharField(max_length=50)
    fecha_ingreso = models.DateTimeField()
    area = models.CharField(max_length=100, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'usuarios'
        ordering = ['id']
    
    def __str__(self):
        return f"{self.name} ({self.email})"
