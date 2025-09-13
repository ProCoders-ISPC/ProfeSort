import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocenteService } from '../../../core/services/docente.service'; 
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
  
  docente: Docente = {
    nombreCompleto: '',
    dni: '',
    domicilio: '',
    email: '',
    estado: ''
  };

  estudiantes: Estudiante[] = [];

  constructor(private router: Router, private docenteService: DocenteService) {}

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
    this.docente = {
      nombreCompleto: 'Juan Pérez',
      dni: '12345678',
      domicilio: 'Calle Principal 123',
      email: 'juan.perez@mail.com',
      estado: 'Activo' 
    };

    this.iniciales = this.obtenerIniciales(this.docente.nombreCompleto);


    this.estudiantes = [
      {
        nombre: 'Ana',
        apellidos: 'García',
        dni: '87654321',
        email: 'ana.garcia@mail.com',
        estado: 'Activo'
      },
      {
        nombre: 'Carlos',
        apellidos: 'López',
        dni: '98765432',
        email: 'carlos.lopez@mail.com',
        estado: 'Pendiente'
      },
      {
        nombre: 'María',
        apellidos: 'Rodríguez',
        dni: '45678912',
        email: 'maria.rodriguez@mail.com',
        estado: 'Activo'
      }
    ];
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