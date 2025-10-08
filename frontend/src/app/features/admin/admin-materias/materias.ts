
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MateriasService, Materia, DocenteSimple } from '../../../core/services/materias.service';
import { APP_CONFIG } from '../../../core/config/app.config';

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
    // Validar campos requeridos usando configuración
    if (!this.formData.nombre?.trim() || !this.formData.codigo?.trim()) {
      this.showError(this.errorMessages.VALIDATION_ERROR);
      return;
    }
    
    this.alertError = '';

    if (this.modoEdicion && this.editandoId) {
      // Si hay docente seleccionado, asignar
      if (this.docenteSeleccionado) {
        this.formData.docenteId = this.docenteSeleccionado.id;
        this.formData.docenteNombre = this.docenteSeleccionado.name;
        this.formData.docenteLegajo = this.docenteSeleccionado.legajo;
        this.formData.docenteDni = this.docenteSeleccionado.dni;
      } else {
        // Quitar docente si se deseleccionó
        this.formData.docenteId = undefined;
        this.formData.docenteNombre = undefined;
        this.formData.docenteLegajo = undefined;
        this.formData.docenteDni = undefined;
      }
      
      this.materiasService.updateMateria(this.editandoId, this.formData).subscribe({
        next: () => {
          this.showMessage(this.successMessages.UPDATE_SUCCESS);
          this.cargarMaterias();
          this.cerrarFormulario();
        },
        error: (err) => {
          this.showError(err.message || this.errorMessages.GENERIC_ERROR);
        }
      });
    } else {
      const { nombre, codigo } = this.formData;
      const nuevaMateria: any = { 
        nombre: nombre!, 
        codigo: codigo!
      };
      
      // Agregar información del docente si fue seleccionado
      if (this.docenteSeleccionado) {
        nuevaMateria.docenteId = this.docenteSeleccionado.id;
        nuevaMateria.docenteNombre = this.docenteSeleccionado.name;
        nuevaMateria.docenteLegajo = this.docenteSeleccionado.legajo;
        nuevaMateria.docenteDni = this.docenteSeleccionado.dni;
      }
      
      this.materiasService.addMateria(nuevaMateria).subscribe({
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
}
