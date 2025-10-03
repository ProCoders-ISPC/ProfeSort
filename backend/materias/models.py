from django.db import models

class Materia(models.Model):
    nombre = models.CharField(max_length=100)
    codigo = models.CharField(max_length=20, unique=True)
    descripcion = models.TextField(blank=True)
    creditos = models.IntegerField(default=0)
    profesor = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name = "Materia"
        verbose_name_plural = "Materias"
