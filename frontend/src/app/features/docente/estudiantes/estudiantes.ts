import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocenteService } from '../../../core/services/docente.service';
import { EstudiantesService, Estudiante as EstudianteAPI, ErrorResponse } from '../../../core/services/estudiantes.service';
import { environment } from '../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
  errorMessage: string = '';
  isLoading: boolean = false;
  estudiantes: Estudiante[] = [];
  estudiantesFiltrados: Estudiante[] = [];
  searchTerm: string = '';

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
    this.cargarEstudiantes();
  }

  filtrarEstudiantes(): void {
    const termino = this.searchTerm.toLowerCase().trim();
    
    if (!termino) {
      this.estudiantesFiltrados = [...this.estudiantes];
      return;
    }

    this.estudiantesFiltrados = this.estudiantes.filter(estudiante =>
      estudiante.nombre.toLowerCase().includes(termino) ||
      estudiante.apellidos.toLowerCase().includes(termino) ||
      estudiante.dni.includes(termino) ||
      estudiante.email.toLowerCase().includes(termino)
    );
  }

  cargarEstudiantes() {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Obtener el ID del docente actual
    const currentUser = this.docenteService.getCurrentUser();
    if (!currentUser?.id) {
      this.errorMessage = 'No se pudo obtener el ID del docente';
      this.isLoading = false;
      return;
    }
    
    this.estudiantesService.getEstudiantesByDocenteId(currentUser.id)
      .pipe(
        catchError((error: ErrorResponse) => {
          console.error('Error al cargar estudiantes:', error);
          this.errorMessage = error.message;
          this.isLoading = false;
          return of([]);
        })
      )
      .subscribe({
        next: (estudiantes) => {
          this.isLoading = false;
          this.estudiantes = estudiantes.map(est => ({
            id: est.id,
            nombre: est.nombre,
            apellidos: est.apellidos,
            dni: est.dni,
            email: est.email,
            estado: est.estado
          }));
          this.estudiantesFiltrados = [...this.estudiantes];
          console.log('Estudiantes cargados:', this.estudiantes);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error inesperado al procesar estudiantes:', error);
          this.errorMessage = 'Error inesperado al cargar los estudiantes';
        }
      });
  }





  private verificarAutenticacion(): boolean {
    return true;
  }
}