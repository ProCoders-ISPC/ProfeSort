
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MateriasService, Materia } from '../../../core/services/materias.service';
import { APP_CONFIG } from '../../../core/config/app.config';

@Component({
  selector: 'app-materias',
  standalone: true,
  templateUrl: './materias.html',
  styleUrls: ['./materias.css'],
  imports: [CommonModule, FormsModule]
})

export class Materias {
  materias: Materia[] = [];
  editandoId: number | null = null;
  eliminarId: number | null = null;
  alertSuccess = '';
  alertError = '';
  showEliminar = false;
  cargandoDatos = true;
  
  mostrarFormulario = false;
  modoEdicion = false;

  // Configuraciones desde APP_CONFIG
  private readonly timeouts = APP_CONFIG.TIMEOUTS;
  private readonly errorMessages = APP_CONFIG.ERROR_MESSAGES;
  private readonly successMessages = APP_CONFIG.SUCCESS_MESSAGES;
  private readonly validationConfig = APP_CONFIG.VALIDATION;

  formData: Partial<Materia> = {
    nombre: '',
    codigo: '',
    profesor: ''
  };

  private materiasService = inject(MateriasService);

  constructor() {
    this.cargarMaterias();
  }

  cargarMaterias(): void {
    this.cargandoDatos = true;
    this.materiasService.getMaterias().subscribe({
      next: (data: Materia[]) => {
        this.materias = data;
        this.cargandoDatos = false;
      },
      error: () => {
        this.materias = [];
        this.cargandoDatos = false;
        this.showError(this.errorMessages.NETWORK_ERROR);
      }
    });
  }

  get sinMaterias(): boolean {
    return !this.cargandoDatos && this.materias.length === 0;
  }
  
  abrirFormularioNuevo(): void {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.resetForm();
  }
  
  abrirFormularioEdicion(materia: Materia): void {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.formData = { ...materia };
    this.editandoId = materia.id;
  }
  
  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.resetForm();
  }

  guardar(): void {
    // Validar campos requeridos usando configuración
    if (!this.formData.nombre?.trim() || !this.formData.codigo?.trim()) {
      this.showError(this.errorMessages.VALIDATION_ERROR);
      return;
    }
    
    this.alertError = '';

    if (this.modoEdicion && this.editandoId) {
      this.materiasService.updateMateria(this.editandoId, this.formData).subscribe({
        next: () => {
          this.showMessage(this.successMessages.UPDATE_SUCCESS);
          this.cargarMaterias();
          this.cerrarFormulario();
        },
        error: (err) => {
          this.showError(err.message || this.errorMessages.GENERIC_ERROR);
        }
      });
    } else {
      const { nombre, codigo, profesor } = this.formData;
      const nuevaMateria = { 
        nombre: nombre!, 
        codigo: codigo!, 
        profesor: profesor || undefined
      };
      this.materiasService.addMateria(nuevaMateria).subscribe({
        next: () => {
          this.showMessage(this.successMessages.SAVE_SUCCESS);
          this.cargarMaterias();
          this.cerrarFormulario();
        },
        error: (err) => {
          this.showError(err.message || this.errorMessages.GENERIC_ERROR);
        }
      });
    }
  }

  editar(materia: Materia): void {
    this.abrirFormularioEdicion(materia);
  }

  confirmarEliminar(id: number): void {
    this.eliminarId = id;
    this.showEliminar = true;
  }

  eliminar(): void {
    if (this.eliminarId) {
      this.materiasService.deleteMateria(this.eliminarId).subscribe({
        next: () => {
          this.showMessage(this.successMessages.DELETE_SUCCESS);
          this.cargarMaterias();
          this.eliminarId = null;
        },
        error: (err) => {
          this.showError(err.message || this.errorMessages.GENERIC_ERROR);
        }
      });
    }
    this.showEliminar = false;
  }

  cancelarEliminar(): void {
    this.eliminarId = null;
    this.showEliminar = false;
  }

  resetForm(): void {
    this.formData = { nombre: '', codigo: '', profesor: '' };
    this.editandoId = null;
    this.alertError = '';
  }
  
  // Obtener texto para mostrar el profesor
  obtenerTextoProfesor(profesor?: string): string {
    return profesor || 'Sin asignar';
  }

  private showMessage(msg: string): void {
    this.alertSuccess = msg;
    setTimeout(() => this.alertSuccess = '', this.timeouts.SUCCESS_MESSAGE_DURATION);
  }

  private showError(msg: string): void {
    this.alertError = msg;
    setTimeout(() => this.alertError = '', this.timeouts.ALERT_DURATION);
  }
}
