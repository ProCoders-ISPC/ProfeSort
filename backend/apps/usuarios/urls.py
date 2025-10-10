from django.urls import path
from .views import RolListView, UsuarioListCreateView, UsuarioDetailView, LoginView, RegisterView

urlpatterns = [
    path('roles/', RolListView.as_view(), name='rol-list'),
    path('', UsuarioListCreateView.as_view(), name='usuario-list-create'),
    path('login/', LoginView.as_view(), name='usuario-login'),
    path('register/', RegisterView.as_view(), name='usuario-register'),
    path('<int:pk>/', UsuarioDetailView.as_view(), name='usuario-detail'),
]
