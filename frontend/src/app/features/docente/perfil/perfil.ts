import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, AuthUser } from '../../../core/services/services';
import { DocenteService } from '../../../core/services/docente.service';
import { AdminDocenteService } from '../../../core/services/admindocente.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-docente-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class DocentePerfil implements OnInit, OnDestroy {
  currentUser: AuthUser | null = null;
  perfilForm: FormGroup;
  modoEdicion = false;
  mensaje = '';
  error = '';
  
  // Propiedades para el tooltip personalizado
  mostrandoTooltip = false;
  mensajeTooltip = '';
  tooltipPosicion = { x: 0, y: 0 };
  private tooltipElement: HTMLElement | null = null;
  private currentTarget: HTMLElement | null = null;
  private scrollListener: (() => void) | null = null;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private docenteService: DocenteService,
    private adminDocenteService: AdminDocenteService,
    private http: HttpClient
  ) {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-ZÀ-ÿ\\u00f1\\u00d1\\s]+$')]],
      email: [{ value: '', disabled: true }],
      legajo: [{ value: '', disabled: true }],
      dni: [{ value: '', disabled: true }], // Solo admin puede modificar
      fechaNacimiento: [''], // Docente puede modificar
      domicilio: ['', [Validators.minLength(5)]], // Docente puede modificar
      telefono: ['', [Validators.pattern('^[0-9]{10,15}$')]] // Docente puede modificar
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        // Usar el nombre completo directamente de la base de datos
        this.perfilForm.patchValue({
          nombre: user.name || '',
          email: user.email || '',
          legajo: user.legajo || 'N/A',
          dni: user.dni || '',
          fechaNacimiento: user.fecha_nacimiento || '',
          domicilio: user.domicilio || '',
          telefono: user.telefono || ''
        });
      }
    });
  }

  toggleEdicion() {
    this.modoEdicion = !this.modoEdicion;
    this.mensaje = '';
    this.error = '';
    
    if (!this.modoEdicion && this.currentUser) {
      // Restaurar valores originales al cancelar edición
      this.perfilForm.patchValue({
        nombre: this.currentUser.name || '',
        fechaNacimiento: this.currentUser.fecha_nacimiento || '',
        domicilio: this.currentUser.domicilio || '',
        telefono: this.currentUser.telefono || ''
      });
    }
  }

  guardarCambios() {
    if (this.perfilForm.valid && this.currentUser) {
      const formData = this.perfilForm.value;
            // Usar el nombre completo directamente del formulario
      const docenteData = {
        name: this.perfilForm.get('nombre')?.value,
        email: this.perfilForm.get('email')?.value,
        dni: this.perfilForm.get('dni')?.value,
        fecha_nacimiento: this.perfilForm.get('fechaNacimiento')?.value,
        domicilio: this.perfilForm.get('domicilio')?.value,
        telefono: this.perfilForm.get('telefono')?.value
      };
      
      // Crear usuario actualizado
      const updatedAuthUser: AuthUser = {
        id: this.currentUser.id,
        name: this.perfilForm.get('nombre')?.value,
        email: this.currentUser.email,
        id_rol: this.currentUser.id_rol,
        legajo: this.currentUser.legajo,
        dni: this.currentUser.dni,
        fecha_nacimiento: formData.fechaNacimiento,
        domicilio: formData.domicilio,
        telefono: formData.telefono,
        area: this.currentUser.area,
        fecha_ingreso: this.currentUser.fecha_ingreso,
        is_active: this.currentUser.is_active
      };
      
      // Usar el método privado saveSession del AuthService para consistencia
      (this.authService as any)['saveSession'](updatedAuthUser);
      
      // Actualizar el AuthService
      this.authService['currentUserSubject'].next(updatedAuthUser);
      
      // Actualizar en la base de datos
      this.actualizarEnBaseDatos(updatedAuthUser);
      
      this.mensaje = 'Perfil actualizado correctamente';
      this.modoEdicion = false;
      
      setTimeout(() => {
        this.mensaje = '';
      }, 3000);
    } else {
      if (!this.perfilForm.valid) {
        this.error = 'Por favor, completa todos los campos requeridos';
        setTimeout(() => {
          this.error = '';
        }, 3000);
      }
    }
  }

  private actualizarEnBaseDatos(updatedUser: AuthUser) {
    if (!this.currentUser) {
      console.error('No hay usuario actual para actualizar');
      return;
    }

    const userData = {
      name: updatedUser.name,
      email: updatedUser.email,
      dni: updatedUser.dni,
      fecha_nacimiento: updatedUser.fecha_nacimiento,
      domicilio: updatedUser.domicilio,
      telefono: updatedUser.telefono
    };

    this.http.patch(`${environment.apiUrl}/usuarios/${this.currentUser.id}/`, userData)
      .subscribe({
        next: (response) => {
          // Perfil actualizado exitosamente
        },
        error: (error) => {
          console.error('Error actualizando perfil:', error);
          this.error = 'Error al guardar los cambios. Inténtalo de nuevo.';
          setTimeout(() => {
            this.error = '';
          }, 3000);
        }
      });
  }

  mostrarTooltip(event: Event): void {
    if (!this.modoEdicion) {
      // Cerrar tooltip anterior si existe
      this.cerrarTooltip();
      
      const target = event.target as HTMLInputElement;
      this.currentTarget = target;
      
      // Mostrar tooltip
      this.mensajeTooltip = 'Activa el modo edición para modificar este campo';
      this.mostrandoTooltip = true;
      
      target.blur(); // Quita el foco del campo
      
      // Posicionar tooltip después de que Angular renderice
      setTimeout(() => {
        this.actualizarPosicionTooltip();
        this.configurarEventListeners();
      }, 0);
      
      // Auto-cerrar después de 5 segundos
      setTimeout(() => {
        this.cerrarTooltip();
      }, 5000);
    }
  }

  private actualizarPosicionTooltip(): void {
    if (this.currentTarget && this.mostrandoTooltip) {
      const rect = this.currentTarget.getBoundingClientRect();
      
      // Calcular posición centrada horizontalmente
      const tooltipWidth = 300;
      let x = rect.left + rect.width / 2 - tooltipWidth / 2;
      
      // Asegurar que no se salga de la pantalla
      const margin = 10;
      if (x < margin) {
        x = margin;
      } else if (x + tooltipWidth > window.innerWidth - margin) {
        x = window.innerWidth - tooltipWidth - margin;
      }
      
      // Para position: fixed, usamos directamente rect.bottom sin scrollY
      this.tooltipPosicion = {
        x: x,
        y: rect.bottom + 8
      };
      
      // console.log('Tooltip posicionado en:', this.tooltipPosicion, 'para campo:', this.currentTarget.getAttribute('formControlName'));
    }
  }

  private configurarEventListeners(): void {
    // Remover listener anterior si existe
    this.removerEventListeners();
    
    // Escuchar scroll para actualizar posición
    this.scrollListener = () => {
      this.actualizarPosicionTooltip();
    };
    
    window.addEventListener('scroll', this.scrollListener);
    window.addEventListener('resize', this.scrollListener);
    
    // Cerrar al hacer click fuera
    document.addEventListener('click', this.onDocumentClick);
  }

  private removerEventListeners(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
      window.removeEventListener('resize', this.scrollListener);
      this.scrollListener = null;
    }
    document.removeEventListener('click', this.onDocumentClick);
  }

  private onDocumentClick = (event: Event) => {
    const target = event.target as HTMLElement;
    // Cerrar si el click no es en el tooltip
    if (target && !target.closest('.custom-tooltip')) {
      this.cerrarTooltip();
    }
  }

  cerrarTooltip(): void {
    this.mostrandoTooltip = false;
    this.mensajeTooltip = '';
    this.currentTarget = null;
    this.removerEventListeners();
  }

  ngOnDestroy(): void {
    this.removerEventListeners();
  }
}
