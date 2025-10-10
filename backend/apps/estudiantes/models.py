from django.db import models
from apps.usuarios.models import Usuario

class Estudiante(models.Model):
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    dni = models.CharField(max_length=20)
    email = models.EmailField(max_length=255)
    estado = models.CharField(max_length=50, default='Activo')
    legajo = models.CharField(max_length=50, unique=True)
    docenteId = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, db_column='docenteId', related_name='estudiantes')
    
    class Meta:
        db_table = 'estudiantes'
        ordering = ['id']
    
    def __str__(self):
        return f"{self.nombre} {self.apellidos} - {self.legajo}"
