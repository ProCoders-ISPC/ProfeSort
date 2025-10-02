import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDocenteService } from '../../../core/services/admindocente.service';

@Component({
  selector: 'app-admindocente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admindocente.html',
  styleUrls: ['./admindocente.css']
})
export class AdminDocente implements OnInit {
  docentes: any[] = [];
  nuevoDocente: any = {};
  docenteSeleccionado: any = null;
  modoEdicion: boolean = false;
  loading: boolean = false;
  error: string | null = null;

  constructor(private adminDocenteService: AdminDocenteService) { }

  ngOnInit(): void {
    this.cargarDocentes();
  }

  cargarDocentes(): void {
    this.loading = true;
    this.adminDocenteService.getDocentes().subscribe({
      next: (data) => {
        this.docentes = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar docentes:', error);
        this.error = 'No se pudieron cargar los docentes. Intente nuevamente.';
        this.loading = false;
      }
    });
  }

  seleccionarDocente(docente: any): void {
    this.docenteSeleccionado = { ...docente };
    this.modoEdicion = true;
  }

  crearDocente(): void {
    this.adminDocenteService.crearDocente(this.nuevoDocente).subscribe({
      next: () => {
        this.cargarDocentes();
        this.nuevoDocente = {};
        alert('Docente creado exitosamente');
      },
      error: (error) => {
        console.error('Error al crear docente:', error);
        alert('Error al crear el docente');
      }
    });
  }

  actualizarDocente(): void {
    if (!this.docenteSeleccionado || !this.docenteSeleccionado.id_usuario) {
      return;
    }

    this.adminDocenteService.actualizarDocente(
      this.docenteSeleccionado.id_usuario, 
      this.docenteSeleccionado
    ).subscribe({
      next: () => {
        this.cargarDocentes();
        this.cancelarEdicion();
        alert('Docente actualizado exitosamente');
      },
      error: (error) => {
        console.error('Error al actualizar docente:', error);
        alert('Error al actualizar el docente');
      }
    });
  }

  eliminarDocente(id: number): void {
    if (confirm('¿Está seguro que desea eliminar este docente?')) {
      this.adminDocenteService.eliminarDocente(id).subscribe({
        next: () => {
          this.cargarDocentes();
          alert('Docente eliminado exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar docente:', error);
          alert('Error al eliminar el docente');
        }
      });
    }
  }

  cancelarEdicion(): void {
    this.docenteSeleccionado = null;
    this.modoEdicion = false;
  }
}