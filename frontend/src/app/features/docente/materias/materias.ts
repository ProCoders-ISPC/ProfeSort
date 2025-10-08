import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MateriasService, Materia } from '../../../core/services/materias.service';
import { AuthService } from '../../../core/services/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './materias.html',
  styleUrl: './materias.css'
})
export class Materias implements OnInit, OnDestroy {
  materias: Materia[] = [];
  loading = false;
  error = '';
  userName = '';
  private userSubscription?: Subscription;

  constructor(
    private materiasService: MateriasService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios del usuario
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.name || 'Docente';
        // Asegurar que obtenemos el ID correcto
        const userId = user.id || (user as any).id_usuario;
        if (userId) {
          this.cargarMaterias(userId);
        } else {
          // Si no hay ID, intentar refrescar la sesión
          this.authService.refreshUserSession();
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  cargarMaterias(docenteId?: number) {
    this.loading = true;
    this.error = '';
    
    // Si no se pasa docenteId, obtenerlo del usuario actual
    if (!docenteId) {
      let user = this.authService.getCurrentUser();
      
      // Si no hay usuario, intentar refrescar la sesión
      if (!user) {
        this.authService.refreshUserSession();
        user = this.authService.getCurrentUser();
      }
      
      if (!user) {
        this.error = 'No hay usuario autenticado. Por favor, inicia sesión nuevamente.';
        this.loading = false;
        return;
      }
      
      // Asegurar que obtenemos el ID correcto, sin importar si viene como 'id' o 'id_usuario'
      docenteId = user?.id || (user as any)?.id_usuario;
    }

    if (!docenteId) {
      this.error = 'No se pudo obtener el ID del docente. Intenta cerrar sesión y volver a iniciar.';
      this.loading = false;
      return;
    }

    console.log('Cargando materias para docente ID:', docenteId);
    
    this.materiasService.getMateriasByDocente(docenteId).subscribe({
      next: (materias) => {
        console.log('Materias cargadas exitosamente:', materias);
        this.materias = materias;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar materias:', err);
        this.error = 'Error al cargar las materias. Verifica tu conexión e inténtalo de nuevo.';
        this.loading = false;
      }
    });
  }
}
