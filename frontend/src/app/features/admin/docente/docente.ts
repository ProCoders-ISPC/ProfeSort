import { Component } from '@angular/core';

interface DocenteModel {
  id: number;
  name: string;
  email: string;
  legajo: string;
  estado: 'Activo' | 'Inactivo';
}

@Component({
  selector: 'app-docente',
  templateUrl: './docente.html',
  styleUrls: ['./docente.css']
})
export class Docente {
  docentes: DocenteModel[] = [
    {
      id: 1,
      name: 'Karina del Valle Quinteros',
      email: 'karinaq38@gmail.com',
      legajo: 'DOC001',
      estado: 'Activo'
    },
    {
      id: 2,
      name: 'Juan Pablo Sanchez Brandán',
      email: 'sanchezbrandan@gmail.com',
      legajo: 'DOC002',
      estado: 'Activo'
    },
    {
      id: 3,
      name: 'Juan Ignacio Gioda',
      email: 'juangioda@gmail.com',
      legajo: 'DOC003',
      estado: 'Inactivo'
    },
    {
      id: 4,
      name: 'Daniel Nicolas Paez',
      email: 'dani.mercadolibre03@gmail.com',
      legajo: 'DOC004',
      estado: 'Activo'
    }
  ];

  formTitle = 'Formulario Docente';
  editingId: number | null = null;
  docenteForm = {
    name: '',
    email: '',
    legajo: '',
    password: '',
    confirmPassword: ''
  };

  editarDocente(id: number) {
    const docente = this.docentes.find(d => d.id === id);
    if (docente) {
      this.editingId = id;
      this.formTitle = 'Editar Docente';
      this.docenteForm = {
        name: docente.name,
        email: docente.email,
        legajo: docente.legajo,
        password: '••••••••',
        confirmPassword: '••••••••'
      };
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
    this.docenteForm = {
      name: '',
      email: '',
      legajo: '',
      password: '',
      confirmPassword: ''
    };
  }

  guardarDocente() {
    const { name, email, legajo, password, confirmPassword } = this.docenteForm;
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
        estado: 'Activo'
      };
      this.docentes.push(newDocente);
      alert('Docente agregado exitosamente');
    }
    this.resetForm();
  }
}