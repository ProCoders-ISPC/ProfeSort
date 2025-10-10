from django.db import models
from apps.usuarios.models import Usuario

class Materia(models.Model):
    nombre = models.CharField(max_length=255)
    codigo = models.CharField(max_length=50)
    horas_semanales = models.IntegerField(blank=True, null=True)
    area = models.CharField(max_length=100, blank=True, null=True)
    nivel = models.CharField(max_length=50, blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'materias'
        ordering = ['id']
    
    def __str__(self):
        return f"{self.nombre} ({self.codigo})"

class AsignacionDocenteMateria(models.Model):
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario', related_name='asignaciones')
    id_materia = models.ForeignKey(Materia, on_delete=models.CASCADE, db_column='id_materia', related_name='asignaciones')
    id_rol = models.IntegerField(default=2)
    fecha_asignacion = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, default='ACTIVO')
    
    class Meta:
        db_table = 'asignaciones_docentes_materias'
        ordering = ['id']
        unique_together = ['id_usuario', 'id_materia']
    
    def __str__(self):
        return f"{self.id_usuario.name} - {self.id_materia.nombre}"
