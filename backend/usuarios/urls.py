from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, RolViewSet, DocenteViewSet

# Router automático para ViewSets
router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'roles', RolViewSet, basename='rol')
router.register(r'docentes', DocenteViewSet, basename='docente')  

urlpatterns = [
    path('', include(router.urls)),
]