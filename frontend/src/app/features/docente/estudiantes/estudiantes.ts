import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocenteService, Docente } from '../../../core/services/docente.service';

interface Estudiante {
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
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Estudiantes implements OnInit {
  modoEdicion: boolean = false;
  iniciales: string = '';
  loading: boolean = false;
  error: string | null = null;
  
  docente: Docente = {
    id: 0,
    nombreCompleto: '',
    dni: '',
    domicilio: '',
    email: '',
    legajo: ''
  };

  estudiantes: Estudiante[] = [];

  constructor(
    private router: Router,
    private docenteService: DocenteService
  ) {}

  ngOnInit() {
    // Verificar autenticación
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
    const docenteId = 1; // TODO: Obtener del servicio de auth
    this.loading = true;
    this.error = null;

    this.docenteService.getDocenteById(docenteId).subscribe({
      next: (data: Docente) => {
        this.docente = data;
        this.iniciales = this.obtenerIniciales(data.nombreCompleto);
        this.loading = false;
      },
      error: (err: Error) => {
        console.error('Error al cargar datos:', err);
        this.error = 'Error al cargar los datos. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  guardarDatos() {
    if (!this.verificarFormulario()) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.docenteService.updateDocente(this.docente.id, {
      nombreCompleto: this.docente.nombreCompleto,
      domicilio: this.docente.domicilio,
      email: this.docente.email
    }).subscribe({
      next: (data: Docente) => {
        this.docente = data;
        this.iniciales = this.obtenerIniciales(data.nombreCompleto);
        this.loading = false;
        this.modoEdicion = false;
        alert('Datos actualizados correctamente');
      },
      error: (err: Error) => {
        console.error('Error al guardar:', err);
        this.error = 'Error al guardar los datos. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  private verificarFormulario(): boolean {
    if (!this.docente.nombreCompleto || !this.docente.domicilio || !this.docente.email) {
      alert('Por favor, complete todos los campos obligatorios');
      return false;
    }
    return true;
  }

  private verificarAutenticacion(): boolean {
    // Aquí implementarías la lógica real de verificación
    // Por ahora retornamos true como ejemplo
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
