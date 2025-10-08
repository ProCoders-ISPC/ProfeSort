
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MateriasService, Materia, DocenteSimple } from '../../../core/services/materias.service';
import { AsignacionesService } from '../../../core/services/asignaciones.service';
import { APP_CONFIG } from '../../../core/config/app.config';
import { switchMap } from 'rxjs/operators';

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
  alertError = '';
  showEliminar = false;
  cargandoDatos = true;
  
  mostrarFormulario = false;
  modoEdicion = false;

  // Búsqueda y selección de docentes
  docentes: DocenteSimple[] = [];
  docentesFiltrados: DocenteSimple[] = [];
  docenteSeleccionado: DocenteSimple | null = null;
  busquedaDocente = '';
  mostrarListaDocentes = false;

  // Configuraciones desde APP_CONFIG
  private readonly timeouts = APP_CONFIG.TIMEOUTS;
  private readonly errorMessages = APP_CONFIG.ERROR_MESSAGES;
  private readonly successMessages = APP_CONFIG.SUCCESS_MESSAGES;
  private readonly validationConfig = APP_CONFIG.VALIDATION;

  formData: Partial<Materia> = {
    nombre: '',
    codigo: ''
  };

  private materiasService = inject(MateriasService);
  private asignacionesService = inject(AsignacionesService);

  constructor() {
    this.cargarMaterias();
    this.cargarDocentes();
  }

  cargarMaterias(): void {
    this.cargandoDatos = true;
    this.materiasService.getMaterias().subscribe({
      next: (data: Materia[]) => {
        this.materias = data;
        this.cargandoDatos = false;
      },
      error: () => {
        this.materias = [];
        this.cargandoDatos = false;
        this.showError(this.errorMessages.NETWORK_ERROR);
      }
    });
  }

  cargarDocentes(): void {
    this.materiasService.getDocentes().subscribe({
      next: (data: DocenteSimple[]) => {
        this.docentes = data;
        this.docentesFiltrados = data;
      },
      error: () => {
        this.docentes = [];
        this.docentesFiltrados = [];
      }
    });
  }

  filtrarDocentes(): void {
    const termino = this.busquedaDocente.toLowerCase().trim();
    
    if (!termino) {
      this.docentesFiltrados = this.docentes;
      this.mostrarListaDocentes = false;
      return;
    }

    this.mostrarListaDocentes = true;
    this.docentesFiltrados = this.docentes.filter(docente => 
      docente.name.toLowerCase().includes(termino) ||
      docente.legajo.toLowerCase().includes(termino) ||
      (docente.dni && docente.dni.includes(termino))
    );
  }

  seleccionarDocente(docente: DocenteSimple): void {
    this.docenteSeleccionado = docente;
    this.busquedaDocente = '';
    this.mostrarListaDocentes = false;
  }

  quitarDocente(): void {
    this.docenteSeleccionado = null;
    this.busquedaDocente = '';
  }

  get sinMaterias(): boolean {
    return !this.cargandoDatos && this.materias.length === 0;
  }
  
  abrirFormularioNuevo(): void {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.resetForm();
  }
  
  abrirFormularioEdicion(materia: Materia): void {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.formData = { ...materia };
    this.editandoId = materia.id;
    
    // Cargar docente si está asignado
    if (materia.docenteId) {
      const docente = this.docentes.find(d => d.id === materia.docenteId);
      if (docente) {
        this.docenteSeleccionado = docente;
      }
    }
  }
  
  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.resetForm();
  }

  guardar(): void {
    console.log('Método guardar() ejecutado');
    console.log('Modo edición:', this.modoEdicion);
    console.log('Editando ID:', this.editandoId);
    console.log('Form data:', this.formData);
    console.log('Docente seleccionado:', this.docenteSeleccionado);
    
    // Validar campos requeridos usando configuración
    console.log('Validando campos:');
    console.log('- formData.nombre:', this.formData.nombre);
    console.log('- formData.codigo:', this.formData.codigo);
    console.log('- nombre.trim():', this.formData.nombre?.trim());
    console.log('- codigo.trim():', this.formData.codigo?.trim());
    
    if (!this.formData.nombre?.trim() || !this.formData.codigo?.trim()) {
      console.log('Error de validación: campos requeridos vacíos');
      console.log('- Falta nombre:', !this.formData.nombre?.trim());
      console.log('- Falta codigo:', !this.formData.codigo?.trim());
      this.showError(this.errorMessages.VALIDATION_ERROR);
      return;
    }
    
    console.log('Validación pasada, continuando...');
    this.alertError = '';

    if (this.modoEdicion && this.editandoId) {
      console.log('Enviando actualización con datos:', this.formData);
      
      // Actualizar datos básicos de la materia (sin docente)
      const materiaData = {
        nombre: this.formData.nombre,
        codigo: this.formData.codigo,
        horas_semanales: this.formData.horas_semanales,
        area: this.formData.area,
        nivel: this.formData.nivel
      };
      
      this.materiasService.updateMateria(this.editandoId, materiaData).pipe(
        switchMap(() => {
          // Después de actualizar la materia, manejar la asignación del docente
          const docenteId = this.docenteSeleccionado ? this.docenteSeleccionado.id : null;
          return this.materiasService.asignarDocente(this.editandoId!, docenteId);
        })
      ).subscribe({
        next: (response) => {
          console.log('Materia y asignación actualizadas exitosamente:', response);
          this.showMessage(this.successMessages.UPDATE_SUCCESS);
          this.cargarMaterias();
          this.cerrarFormulario();
        },
        error: (err) => {
          console.error('Error actualizando materia:', err);
          this.showError(err.message || this.errorMessages.GENERIC_ERROR);
        }
      });
    } else {
      const { nombre, codigo, horas_semanales, area, nivel } = this.formData;
      const nuevaMateria: any = { 
        nombre: nombre!, 
        codigo: codigo!,
        horas_semanales,
        area,
        nivel
      };
      
      // Primero crear la materia
      this.materiasService.addMateria(nuevaMateria).pipe(
        switchMap((materiaCreada: any) => {
          // Si hay docente seleccionado, crear la asignación
          if (this.docenteSeleccionado) {
            return this.materiasService.asignarDocente(
              materiaCreada.id, 
              this.docenteSeleccionado.id
            );
          }
          // Si no hay docente, retornar la materia creada
          return [materiaCreada];
        })
      ).subscribe({
        next: () => {
          this.showMessage(this.successMessages.SAVE_SUCCESS);
          this.cargarMaterias();
          this.cerrarFormulario();
        },
        error: (err) => {
          this.showError(err.message || this.errorMessages.GENERIC_ERROR);
        }
      });
    }
  }

  editar(materia: Materia): void {
    this.abrirFormularioEdicion(materia);
  }

  confirmarEliminar(id: number): void {
    this.eliminarId = id;
    this.showEliminar = true;
  }

  eliminar(): void {
    if (this.eliminarId) {
      const idAEliminar = this.eliminarId;
      this.materiasService.deleteMateria(idAEliminar).subscribe({
        next: () => {
          // Actualizar la lista localmente primero para respuesta inmediata
          this.materias = this.materias.filter(m => m.id !== idAEliminar);
          this.showMessage(this.successMessages.DELETE_SUCCESS);
          this.eliminarId = null;
          this.showEliminar = false;
          // Recargar desde el servidor para sincronizar
          this.cargarMaterias();
        },
        error: (err) => {
          this.showError(err.message || this.errorMessages.GENERIC_ERROR);
          this.eliminarId = null;
          this.showEliminar = false;
        }
      });
    } else {
      this.showEliminar = false;
    }
  }

  cancelarEliminar(): void {
    this.eliminarId = null;
    this.showEliminar = false;
  }

  resetForm(): void {
    this.formData = { nombre: '', codigo: '' };
    this.editandoId = null;
    this.alertError = '';
    this.docenteSeleccionado = null;
    this.busquedaDocente = '';
    this.mostrarListaDocentes = false;
  }

  private showMessage(msg: string): void {
    this.alertSuccess = msg;
    setTimeout(() => this.alertSuccess = '', this.timeouts.SUCCESS_MESSAGE_DURATION);
  }

  private showError(msg: string): void {
    this.alertError = msg;
    setTimeout(() => this.alertError = '', this.timeouts.ALERT_DURATION);
  }

  guardarManual(): void {
    console.log('=== CLICK EN GUARDAR MANUAL ===');
    console.log('Modo edición:', this.modoEdicion);
    console.log('Editando ID:', this.editandoId);
    console.log('Form data:', this.formData);
    this.guardar();
  }

  debugFormState(form: any): void {
    console.log('Estado del formulario:');
    console.log('- Valid:', form.valid);
    console.log('- Invalid:', form.invalid);
    console.log('- Errors:', form.errors);
    console.log('- Form values:', form.value);
    console.log('- Controles:');
    
    Object.keys(form.controls).forEach(key => {
      const control = form.controls[key];
      console.log(`  ${key}:`, {
        value: control.value,
        valid: control.valid,
        errors: control.errors
      });
    });
  }
}
