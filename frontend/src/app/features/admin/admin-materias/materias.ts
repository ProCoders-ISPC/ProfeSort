
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
  showEliminar = false;


  // Modelo del formulario
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
    this.materiasService.getMaterias().subscribe({
      next: (data: Materia[]) => this.materias = data,
      error: () => this.materias = []
    });
  }

  get sinMaterias(): boolean {
    return this.materias.length === 0;
  }

  guardar(): void {
    if (!this.formData.nombre || !this.formData.codigo || !this.formData.profesor) return;

    if (this.editandoId) {
      this.materiasService.updateMateria(this.editandoId, this.formData).subscribe({
        next: () => {
          this.showMessage('Materia actualizada exitosamente!');
          this.cargarMaterias();
          this.resetForm();
        }
      });
    } else {
      const { nombre, codigo, profesor } = this.formData;
      this.materiasService.addMateria({ nombre: nombre!, codigo: codigo!, profesor: profesor! }).subscribe({
        next: () => {
          this.showMessage('Materia guardada exitosamente!');
          this.cargarMaterias();
          this.resetForm();
        }
      });
    }
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
      this.materiasService.deleteMateria(this.eliminarId).subscribe({
        next: () => {
          this.showMessage('Materia eliminada exitosamente!');
          this.cargarMaterias();
          this.eliminarId = null;
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
  }

  private showMessage(msg: string): void {
    this.alertSuccess = msg;
    setTimeout(() => this.alertSuccess = '', 2000);
  }
}
