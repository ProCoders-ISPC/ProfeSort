from django.contrib import admin
from django.urls import path, include
from apps.core.views import APIRootView
from apps.gestion_academica.views import AsignacionDocenteMateriaListCreateView, AsignacionDocenteMateriaDetailView

urlpatterns = [
    path('', APIRootView.as_view(), name='api-root'),
    path('admin/', admin.site.urls),
    path('usuarios/', include('apps.usuarios.urls')),
    path('estudiantes/', include('apps.estudiantes.urls')),
    path('materias/', include('apps.gestion_academica.urls')),
    path('asignaciones_docentes_materias/', AsignacionDocenteMateriaListCreateView.as_view(), name='asignacion-list-create'),
    path('asignaciones_docentes_materias/<int:pk>/', AsignacionDocenteMateriaDetailView.as_view(), name='asignacion-detail'),
]
