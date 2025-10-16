
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  docentes: DocenteSimple[] = [];
  docentesFiltrados: DocenteSimple[] = [];
  docenteSeleccionado: DocenteSimple | null = null;
  busquedaDocente = '';
  mostrarListaDocentes = false;

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
    console.log('🔄 Recargando materias...');
    this.cargandoDatos = true;
    this.materiasService.getMaterias().subscribe({
      next: (data: Materia[]) => {
        console.log('✅ Materias cargadas:', data);
        console.log('📊 Total materias:', data.length);
        data.forEach((m, i) => {
          console.log(`  Materia ${i + 1}:`, {
            nombre: m.nombre,
            codigo: m.codigo,
            docenteId: m.docenteId,
            docenteNombre: m.docenteNombre,
            docenteLegajo: m.docenteLegajo
          });
        });
        this.materias = data;
        this.cargandoDatos = false;
      },
      error: (err) => {
        console.error('❌ Error cargando materias:', err);
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
    console.log('🚀 abrirFormularioNuevo() ejecutado');
    console.log('Estado antes - mostrarFormulario:', this.mostrarFormulario);
    this.modoEdicion = false;
    this.resetForm();
    this.mostrarFormulario = true; 
    console.log('Estado después - mostrarFormulario:', this.mostrarFormulario);
  }
  
  abrirFormularioEdicion(materia: Materia): void {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.formData = { ...materia };
    this.editandoId = materia.id;
    
 
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
 
    setTimeout(() => {
      this.resetForm();
    }, 100);
  }

  guardar(): void {
    console.log('Método guardar() ejecutado');
    console.log('Modo edición:', this.modoEdicion);
    console.log('Editando ID:', this.editandoId);
    console.log('Form data:', this.formData);
    console.log('Docente seleccionado:', this.docenteSeleccionado);
    
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
 

      const materiaData = {
        nombre: this.formData.nombre,
        codigo: this.formData.codigo,
        horas_semanales: this.formData.horas_semanales,
        area: this.formData.area,
        nivel: this.formData.nivel
      };
      
      this.materiasService.updateMateria(this.editandoId, materiaData).pipe(
        switchMap(() => {

          const docenteId = this.docenteSeleccionado ? this.docenteSeleccionado.id : null;
          return this.materiasService.asignarDocente(this.editandoId!, docenteId);
        })
      ).subscribe({
        next: (response) => {
          console.log('Materia y asignación actualizadas exitosamente:', response);
          this.showMessage(this.successMessages.UPDATE_SUCCESS);
          this.resetForm();
          this.cargarMaterias();
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
      

      this.materiasService.addMateria(nuevaMateria).pipe(
        switchMap((materiaCreada: any) => {

          if (this.docenteSeleccionado) {
            return this.materiasService.asignarDocente(
              materiaCreada.id, 
              this.docenteSeleccionado.id
            );
          }

          return [materiaCreada];
        })
      ).subscribe({
        next: () => {
          this.showMessage(this.successMessages.SAVE_SUCCESS);
          this.resetForm();
          this.cargarMaterias();
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

          this.materias = this.materias.filter(m => m.id !== idAEliminar);
          this.showMessage(this.successMessages.DELETE_SUCCESS);
          this.eliminarId = null;
          this.showEliminar = false;

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
    this.modoEdicion = false;
    this.mostrarFormulario = false;
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
