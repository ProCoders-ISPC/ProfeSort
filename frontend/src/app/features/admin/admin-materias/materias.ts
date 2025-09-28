
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MateriasService, Materia } from '../../../core/services/materias.service';

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
        this.showError('Error al cargar las materias');
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
    // Solo validar campos requeridos: nombre y código
    if (!this.formData.nombre?.trim() || !this.formData.codigo?.trim()) {
      this.showError('El nombre y código de la materia son obligatorios');
      return;
    }
    
    this.alertError = '';

    if (this.modoEdicion && this.editandoId) {
      this.materiasService.updateMateria(this.editandoId, this.formData).subscribe({
        next: () => {
          this.showMessage('Materia actualizada exitosamente!');
          this.cargarMaterias();
          this.cerrarFormulario();
        },
        error: (err) => {
          this.showError(err.message || 'Error al actualizar la materia.');
        }
      });
    } else {
      const { nombre, codigo, profesor } = this.formData;
      const nuevaMateria = { 
        nombre: nombre!, 
        codigo: codigo!, 
        profesor: profesor || undefined  // Si está vacío, no se envía profesor
      };
      this.materiasService.addMateria(nuevaMateria).subscribe({
        next: () => {
          this.showMessage('Materia guardada exitosamente!');
          this.cargarMaterias();
          this.cerrarFormulario();
        },
        error: (err) => {
          this.showError(err.message || 'Error al guardar la materia.');
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
          this.showMessage('Materia eliminada exitosamente!');
          this.cargarMaterias();
          this.eliminarId = null;
        },
        error: (err) => {
          this.showError(err.message || 'Error al eliminar la materia.');
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
    setTimeout(() => this.alertSuccess = '', 2000);
  }

  private showError(msg: string): void {
    this.alertError = msg;
    setTimeout(() => this.alertError = '', 3000);
  }
}
