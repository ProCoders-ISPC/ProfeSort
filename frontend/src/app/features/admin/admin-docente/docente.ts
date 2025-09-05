import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { DocenteService } from '../../../core/services/admin-docente.service';
import { DocenteModel } from '../../../core/models/models';

@Component({
  selector: 'app-docente',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './docente.html',
  styleUrls: ['./docente.css']
})
export class Docente implements OnInit {
  docentes: DocenteModel[] = [];
  error: string | null = null;
  formTitle = 'Formulario Docente';
  editingId: number | null = null;
  docenteForm: FormGroup;

  constructor(private docenteService: DocenteService, private fb: FormBuilder) {
    this.docenteForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      legajo: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.docenteService.getDocentesCarga().subscribe({
      next: (data) => this.docentes = data,
      error: () => this.error = 'Error al cargar los datos'
    });
  }

  editarDocente(id: number) {
    const docente = this.docentes.find(d => d.id === id);
    if (docente) {
      this.editingId = id;
      this.formTitle = 'Editar Docente';
      this.docenteForm.setValue({
        name: docente.name,
        email: docente.email,
        legajo: docente.legajo,
        password: '••••••••',
        confirmPassword: '••••••••'
      });
    }
  }

  eliminarDocente(id: number) {
    const docente = this.docentes.find(d => d.id === id);
    if (docente && confirm(`¿Está seguro de que desea eliminar al docente "${docente.name}"?`)) {
      this.docentes = this.docentes.filter(d => d.id !== id);
      alert('Docente eliminado exitosamente');
      this.resetForm();
    }
  }

  resetForm() {
    this.editingId = null;
    this.formTitle = 'Formulario Docente';
    this.docenteForm.reset();
  }

  guardarDocente() {
    const { name, email, legajo, password, confirmPassword } = this.docenteForm.value;
    if (password !== confirmPassword && password !== '••••••••') {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (this.editingId) {
      const index = this.docentes.findIndex(d => d.id === this.editingId);
      if (index !== -1) {
        this.docentes[index] = {
          ...this.docentes[index],
          name,
          email,
          legajo
        };
        alert('Docente actualizado exitosamente');
      }
    } else {
      const newDocente: DocenteModel = {
        id: Date.now(),
        name,
        email,
        legajo,
        materias: 0,
        estado: 'Activo' ,
        estudiantes: 0
      };
      this.docentes.push(newDocente);
      alert('Docente agregado exitosamente');
    }
    this.resetForm();
  }
}