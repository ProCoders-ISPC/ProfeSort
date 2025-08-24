import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Materia {
  id: number;
  nombre: string;
  codigo: string;
  profesor: string;
}

@Component({
  selector: 'app-materias',
  standalone: true,
  templateUrl: './materias.html',
  styleUrls: ['./materias.css'],
  imports: [CommonModule, FormsModule]
})
export class Materias {
  materias: Materia[] = [
    { id: 1, nombre: 'Matemática', codigo: 'MAT101', profesor: 'Prof. Juan Pérez' }
  ];

  editandoId: number | null = null;
  eliminarId: number | null = null;
  alertSuccess = '';
  showEliminar = false;

  // Modelo del formulario
  formData: Partial<Materia> = {
    nombre: '',
    codigo: '',
    profesor: ''
  };

  get sinMaterias(): boolean {
    return this.materias.length === 0;
  }

  guardar(): void {
    if (!this.formData.nombre || !this.formData.codigo || !this.formData.profesor) return;

    if (this.editandoId) {
      const idx = this.materias.findIndex(m => m.id === this.editandoId);
      if (idx !== -1) {
        this.materias[idx] = { id: this.editandoId, ...this.formData } as Materia;
        this.showMessage('Materia actualizada exitosamente!');
      }
    } else {
      const nueva: Materia = {
        id: Date.now(),
        nombre: this.formData.nombre!,
        codigo: this.formData.codigo!,
        profesor: this.formData.profesor!
      };
      this.materias.push(nueva);
      this.showMessage('Materia guardada exitosamente!');
    }
    this.resetForm();
  }

  editar(materia: Materia): void {
    this.formData = { ...materia };
    this.editandoId = materia.id;
  }

  confirmarEliminar(id: number): void {
    this.eliminarId = id;
    this.showEliminar = true;
  }

  eliminar(): void {
    if (this.eliminarId) {
      this.materias = this.materias.filter(m => m.id !== this.eliminarId);
      this.showMessage('Materia eliminada exitosamente!');
      this.eliminarId = null;
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
  }

  private showMessage(msg: string): void {
    this.alertSuccess = msg;
    setTimeout(() => this.alertSuccess = '', 2000);
  }
}
