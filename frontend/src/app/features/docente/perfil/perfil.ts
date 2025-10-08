import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, AuthUser } from '../../../core/services/services';

@Component({
  selector: 'app-docente-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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
    private fb: FormBuilder
  ) {
    this.perfilForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      legajo: [{ value: '', disabled: true }],
      dni: [''], // Opcional
      fechaNacimiento: [''], // Opcional
      domicilio: [''], // Opcional
      telefono: [''] // Opcional
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        const userData = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
        this.perfilForm.patchValue({
          name: user.name,
          email: user.email,
          legajo: user.legajo || 'N/A',
          dni: userData.dni || '',
          fechaNacimiento: userData.fechaNacimiento || '',
          domicilio: userData.domicilio || '',
          telefono: userData.telefono || ''
        });
      }
    });
  }

  toggleEdicion() {
    this.modoEdicion = !this.modoEdicion;
    this.mensaje = '';
    this.error = '';
    
    if (!this.modoEdicion && this.currentUser) {
      this.perfilForm.patchValue({
        name: this.currentUser.name
      });
    }
  }

  guardarCambios() {
    console.log('Intentando guardar cambios...');
    console.log('Formulario válido:', this.perfilForm.valid);
    console.log('Usuario actual:', this.currentUser);
    console.log('Valores del formulario:', this.perfilForm.value);
    console.log('Errores del formulario:', this.perfilForm.errors);
    
    // Verificar errores específicos en cada campo
    Object.keys(this.perfilForm.controls).forEach(key => {
      const control = this.perfilForm.get(key);
      if (control && control.errors) {
        console.log(`Campo ${key} tiene errores:`, control.errors);
      }
    });
    
    if (this.perfilForm.valid && this.currentUser) {
      const userData = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      const updatedUser = {
        ...userData,
        ...this.currentUser,
        name: this.perfilForm.get('name')?.value,
        dni: this.perfilForm.get('dni')?.value,
        fechaNacimiento: this.perfilForm.get('fechaNacimiento')?.value,
        domicilio: this.perfilForm.get('domicilio')?.value,
        telefono: this.perfilForm.get('telefono')?.value
      };
      
      console.log('Guardando usuario actualizado:', updatedUser);
      
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.authService['currentUserSubject'].next(updatedUser);
      
      this.mensaje = 'Perfil actualizado correctamente';
      this.modoEdicion = false;
      
      setTimeout(() => {
        this.mensaje = '';
      }, 3000);
    } else {
      console.log('No se puede guardar: formulario inválido o usuario no existe');
      if (!this.perfilForm.valid) {
        this.error = 'Por favor, completa todos los campos requeridos';
        setTimeout(() => {
          this.error = '';
        }, 3000);
      }
    }
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
