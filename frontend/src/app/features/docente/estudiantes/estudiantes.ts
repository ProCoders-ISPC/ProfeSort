import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocenteService } from '../../../core/services/docente.service';
import { EstudiantesService, Estudiante as EstudianteAPI, ErrorResponse } from '../../../core/services/estudiantes.service';
import { environment } from '../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface Docente {
  nombreCompleto: string;
  dni: string;
  domicilio: string;
  email: string;
  estado: string; 
}

interface Estudiante {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  email: string;
  estado: string;
}

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.html',
  styleUrls: ['./estudiantes.css'],
  imports: [CommonModule, FormsModule]
})

  export class Estudiantes implements OnInit {
  modoEdicion: boolean = false;
  iniciales: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  
  docente: Docente = {
    nombreCompleto: '',
    dni: '',
    domicilio: '',
    email: '',
    estado: ''
  };

  estudiantes: Estudiante[] = [];

  constructor(
    private router: Router, 
    private docenteService: DocenteService,
    private estudiantesService: EstudiantesService
  ) {}

  ngOnInit() {
    if (!this.verificarAutenticacion()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarDatos();
  }

  toggleEdicion() {
    this.modoEdicion = !this.modoEdicion;
  }

  cargarDatos() {
    const currentUser = this.docenteService.getCurrentUser();
    
    if (currentUser) {
      this.docente = {
        nombreCompleto: currentUser.name,
        dni: currentUser.legajo || 'N/A',
        domicilio: 'No disponible',
        email: currentUser.email,
        estado: 'Activo'
      };
      this.iniciales = this.obtenerIniciales(this.docente.nombreCompleto);
    }

    this.cargarEstudiantes();
  }

  cargarEstudiantes() {
    this.isLoading = true;
    this.errorMessage = '';
    
    const docenteId = 1; // Por ahora usar ID fijo, debería venir del contexto de autenticación
    
    this.estudiantesService.getEstudiantesByDocenteId(docenteId)
      .pipe(
        catchError((error: ErrorResponse) => {
          console.error('Error al cargar estudiantes:', error);
          this.errorMessage = error.message;
          
          // En caso de error, cargar datos mock como fallback
          this.estudiantes = [
            {
              id: 1,
              nombre: 'Ana',
              apellidos: 'García',
              dni: '87654321',
              email: 'ana.garcia@mail.com',
              estado: 'Activo'
            },
            {
              id: 2,
              nombre: 'Carlos',
              apellidos: 'López',
              dni: '98765432',
              email: 'carlos.lopez@mail.com',
              estado: 'Pendiente'
            },
            {
              id: 3,
              nombre: 'María',
              apellidos: 'Rodríguez',
              dni: '45678912',
              email: 'maria.rodriguez@mail.com',
              estado: 'Activo'
            }
          ];
          return of([]);
        })
      )
      .subscribe({
        next: (estudiantes) => {
          this.isLoading = false;
          if (estudiantes && estudiantes.length > 0) {
            console.log('Estudiantes cargados exitosamente desde la API:', estudiantes);
            this.estudiantes = estudiantes.map(est => ({
              id: est.id,
              nombre: est.nombre,
              apellidos: est.apellidos,
              dni: est.dni,
              email: est.email,
              estado: est.estado
            }));
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error inesperado al procesar estudiantes:', error);
          this.errorMessage = 'Error inesperado al cargar los estudiantes';
        }
      });
  }

  guardarDatos() {
    try {
      const docenteId = (this.docente as any).id || 1; 
      this.docenteService.updateDocente(docenteId, this.docente)
        .pipe(
          catchError(error => {
            alert('Error al guardar los datos');
            return of(null);
          })
        )
        .subscribe(res => {
          if (res) {
            this.modoEdicion = false;
            alert('Datos actualizados correctamente');
          }
        });
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar los datos');
    }
  }

  /**
   * Actualizar el estado de un estudiante
   */
  actualizarEstadoEstudiante(estudiante: Estudiante, nuevoEstado: string) {
    this.isLoading = true;
    this.errorMessage = '';

    this.estudiantesService.actualizarEstudiante(estudiante.id, { estado: nuevoEstado })
      .pipe(
        catchError((error: ErrorResponse) => {
          console.error('Error al actualizar estudiante:', error);
          this.errorMessage = `Error al actualizar estudiante: ${error.message}`;
          if (error.errors && error.errors.length > 0) {
            this.errorMessage += '\n' + this.estudiantesService.formatearErroresValidacion(error.errors);
          }
          return of(null);
        })
      )
      .subscribe({
        next: (estudianteActualizado) => {
          this.isLoading = false;
          if (estudianteActualizado) {
            // Actualizar el estudiante en la lista local
            const index = this.estudiantes.findIndex(e => e.id === estudiante.id);
            if (index !== -1) {
              this.estudiantes[index] = {
                ...this.estudiantes[index],
                estado: estudianteActualizado.estado
              };
            }
            console.log('Estudiante actualizado exitosamente');
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error inesperado al actualizar estudiante:', error);
          this.errorMessage = 'Error inesperado al actualizar el estudiante';
        }
      });
  }

  /**
   * Eliminar un estudiante
   */
  eliminarEstudiante(estudiante: Estudiante) {
    if (!confirm(`¿Está seguro de que desea eliminar al estudiante ${estudiante.nombre} ${estudiante.apellidos}?`)) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.estudiantesService.eliminarEstudiante(estudiante.id)
      .pipe(
        catchError((error: ErrorResponse) => {
          console.error('Error al eliminar estudiante:', error);
          this.errorMessage = `Error al eliminar estudiante: ${error.message}`;
          return of(null);
        })
      )
      .subscribe({
        next: () => {
          this.isLoading = false;
          // Remover el estudiante de la lista local
          this.estudiantes = this.estudiantes.filter(e => e.id !== estudiante.id);
          console.log('Estudiante eliminado exitosamente');
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error inesperado al eliminar estudiante:', error);
          this.errorMessage = 'Error inesperado al eliminar el estudiante';
        }
      });
  }

  private verificarAutenticacion(): boolean {

    return true;
  }

  private obtenerIniciales(nombre: string): string {
    return nombre
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }
}