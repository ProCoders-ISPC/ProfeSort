from django.db import models

class AsignacionDocenteMateria(models.Model):
    id_asignacion = models.AutoField(primary_key=True)
    id_rol = models.IntegerField()
    id_materia = models.IntegerField()
    fecha_asignacion = models.DateField(auto_now_add=True)
    estado = models.CharField(max_length=50, default='Activa')

    class Meta:
        db_table = 'asignaciones_docentes_materias'


