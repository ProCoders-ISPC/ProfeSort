from django.urls import path
from .views import EstudianteListCreateView, EstudianteDetailView

urlpatterns = [
    path('', EstudianteListCreateView.as_view(), name='estudiante-list-create'),
    path('<int:pk>/', EstudianteDetailView.as_view(), name='estudiante-detail'),
]
