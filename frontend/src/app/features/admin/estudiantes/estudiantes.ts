import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


export interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  escuelaDeProcedencia: string;
  anioCursado: string;
}

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.html',
  styleUrls: ['./estudiantes.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class EstudiantesComponent implements OnInit {
  estudianteForm!: FormGroup;
  modalForm!: FormGroup; //
  estudiantes: Estudiante[] = [];
  estudiantesFiltrados: Estudiante[] = [];
  editandoEstudiante: Estudiante | null = null;
  estudianteSeleccionado: Estudiante | null = null;
  modalTitle: string = '';
  modalEditMode: boolean = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.estudianteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
      escuelaDeProcedencia: ['', Validators.required],
      anioCursado: ['', Validators.required]
    });

    this.modalForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
      escuelaDeProcedencia: ['', Validators.required],
      anioCursado: ['', Validators.required]
    });

    this.estudiantes = [
      { id: 1, nombre: 'Juan', apellido: 'Pérez', dni: '12345678', email: 'juan.perez@example.com', escuelaDeProcedencia: 'Escuela Técnica N°1', anioCursado: '3° año' },
      { id: 2, nombre: 'María', apellido: 'García', dni: '87654321', email: 'maria.garcia@example.com', escuelaDeProcedencia: 'Colegio Nacional', anioCursado: '2° año' }
    ];
    this.estudiantesFiltrados = [...this.estudiantes];
  }
  buscarEstudiantes(termino: string): void {
    const t = termino.trim().toLowerCase();
    if (!t) {
      this.estudiantesFiltrados = [...this.estudiantes];
      return;
    }
    this.estudiantesFiltrados = this.estudiantes.filter(e =>
      (`${e.nombre} ${e.apellido}`.toLowerCase().includes(t) ||
        e.dni.includes(t))
    );
  }

  onSubmit(): void {
    if (this.estudianteForm.valid) {
      if (this.editandoEstudiante) {
        const estudianteAEditar = this.editandoEstudiante;
        const index = this.estudiantes.findIndex(e => e.id === estudianteAEditar.id);
        if (index !== -1) {
          this.estudiantes[index] = { ...estudianteAEditar, ...this.estudianteForm.value };
        }
        this.cancelarEdicion();
      } else {
        const nuevoEstudiante: Estudiante = {
          id: this.estudiantes.length > 0 ? Math.max(...this.estudiantes.map(e => e.id)) + 1 : 1,
          ...this.estudianteForm.value
        };
        this.estudiantes.push(nuevoEstudiante);
      }
      this.estudiantesFiltrados = [...this.estudiantes];
      this.estudianteForm.reset();
      this.modalEditMode = false;
      this.estudianteSeleccionado = null;
      // Cerrar modal programáticamente
      const modal = document.getElementById('estudianteModal');
      if (modal) {
        const modalInstance = (window as any).bootstrap?.Modal?.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
    } else {
      this.estudianteForm.markAllAsTouched();
    }
  }

  cancelarEdicion(): void {
    this.editandoEstudiante = null;
    this.estudianteForm.reset();
  }

  verFicha(estudiante: Estudiante): void {
    this.estudianteSeleccionado = estudiante;
    this.modalTitle = 'Ficha del Estudiante';
    this.modalEditMode = false;
  }

  editarEstudiante(estudiante: Estudiante): void {
    this.estudianteSeleccionado = estudiante;
    this.editandoEstudiante = estudiante;
    this.modalTitle = 'Editar Estudiante';
    this.modalEditMode = true;
    this.estudianteForm.setValue({
      nombre: estudiante.nombre,
      apellido: estudiante.apellido,
      dni: estudiante.dni,
      email: estudiante.email,
      escuelaDeProcedencia: estudiante.escuelaDeProcedencia,
      anioCursado: estudiante.anioCursado
    });
  }

  guardarCambiosModal(): void {
    if (this.modalForm.valid && this.estudianteSeleccionado) {
      const index = this.estudiantes.findIndex(e => e.id === this.estudianteSeleccionado?.id);
      if (index !== -1) {
        this.estudiantes[index] = { ...this.estudianteSeleccionado, ...this.modalForm.value };
      }
      this.modalForm.reset();
      this.estudianteSeleccionado = null;
      this.modalEditMode = false;
    }
  }

  eliminarEstudiante(id: number): void {
    this.estudiantes = this.estudiantes.filter(e => e.id !== id);
    this.estudiantesFiltrados = [...this.estudiantes];
  }
}
