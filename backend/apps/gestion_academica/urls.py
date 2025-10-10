from django.urls import path
from .views import (
    MateriaListCreateView, MateriaDetailView,
    AsignacionDocenteMateriaListCreateView, AsignacionDocenteMateriaDetailView
)

urlpatterns = [
    path('', MateriaListCreateView.as_view(), name='materia-list-create'),
    path('<int:pk>/', MateriaDetailView.as_view(), name='materia-detail'),
]
