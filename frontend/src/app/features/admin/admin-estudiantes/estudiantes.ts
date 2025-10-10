
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EstudiantesService, Estudiante } from 'src/app/core/services/estudiantes.service';
import { EnConstruccionComponent } from '../../../shared/components/en-construccion/en-construccion.component';

@Component({
  selector: 'app-estudiantes',
  template: `
    <div class="container-fluid px-4 py-3">
      <app-en-construccion 
        mensaje="La gestion de estudiantes esta siendo desarrollada actualmente. Esta funcionalidad estara disponible proximamente con registro completo de estudiantes, asignacion a docentes y seguimiento academico.">
      </app-en-construccion>
    </div>
  `,
  styleUrls: ['./estudiantes.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EnConstruccionComponent]
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

  constructor(private fb: FormBuilder, private estudiantesService: EstudiantesService) { }

  ngOnInit(): void {
    this.estudianteForm = this.fb.group({
      nombre: ['', Validators.required],
      legajo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      estado: ['', Validators.required]
    });

    this.modalForm = this.fb.group({
      nombre: ['', Validators.required],
      legajo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      estado: ['', Validators.required]
    });

    // Módulo en desarrollo - no cargar datos
    // this.estudiantesService.getEstudiantes().subscribe((data: Estudiante[]) => {
    //   this.estudiantes = data;
    //   this.estudiantesFiltrados = [...this.estudiantes];
    // });
  }
  buscarEstudiantes(termino: string): void {
    const t = termino.trim().toLowerCase();
    if (!t) {
      this.estudiantesFiltrados = [...this.estudiantes];
      return;
    }
    this.estudiantesFiltrados = this.estudiantes.filter(e =>
      (e.nombre.toLowerCase().includes(t) ||
        e.legajo.toLowerCase().includes(t) ||
        e.email.toLowerCase().includes(t))
    );
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.buscarEstudiantes(target.value);
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
      legajo: estudiante.legajo,
      email: estudiante.email,
      estado: estudiante.estado
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
