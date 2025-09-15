import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminDocenteService, DocenteCarga, EstadisticasCarga } from '../../../core/services/admindocente.service';
import { Subject, takeUntil } from 'rxjs';

interface DocenteModel {
  id: number;
  name: string;
  email: string;
  legajo: string;
  estado: 'Activo' | 'Inactivo';
}

@Component({
  selector: 'app-docente',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admindocente.html',
  styleUrls: ['./admindocente.css']
})
export class Docente implements OnInit, OnDestroy {
  // Propiedades del formulario
  docenteForm: FormGroup;
  docentes: DocenteModel[] = [];
  
  // Propiedades de edición
  isEditing = false;
  editingIndex = -1;
  editandoDocente = false;
  docenteEditandoId: number | null = null;

  // Propiedades para informe de carga
  docentesCarga: DocenteCarga[] = [];
  estadisticasCarga: EstadisticasCarga | null = null;
  cargandoDatos = false;
  errorCarga = '';
  mostrarInformeCarga = false;
  
  // Control de suscripciones
  private destroy$ = new Subject<void>();

  private fb = inject(FormBuilder);
  private adminDocenteService = inject(AdminDocenteService);
new: any;

  // Nueva propiedad para la fecha de actualización
  fechaUltimaActualizacion: string = new Date().toLocaleString();

  constructor() {
    this.docenteForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      legajo: ['', [Validators.required]],
      estado: ['Activo', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarDocentesIniciales();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // MÉTODOS PARA INFORME DE CARGA

  /**
   * Alternar la visibilidad del informe de carga
   */
  toggleInformeCarga(): void {
    this.mostrarInformeCarga = !this.mostrarInformeCarga;
    
    if (this.mostrarInformeCarga && this.docentesCarga.length === 0) {
      this.cargarInformeCarga();
    }
  }

  /**
   * Cargar datos del informe de carga desde el API
   */
  cargarInformeCarga(): void {
    this.cargandoDatos = true;
    this.errorCarga = '';
    
    console.log('Iniciando carga de datos de informe...');
    
    this.adminDocenteService.getDocentesCarga()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: DocenteCarga[]) => {
          console.log('Datos de carga recibidos:', data);
          this.docentesCarga = data;
          this.calcularEstadisticas();
          this.cargandoDatos = false;
          // Actualizar la fecha cuando se cargan los datos
          this.fechaUltimaActualizacion = new Date().toLocaleString();
        },
        error: (error) => {
          console.error('Error al cargar datos de carga:', error);
          this.errorCarga = error.message || 'Error al cargar los datos. Por favor, intente nuevamente.';
          this.cargandoDatos = false;
          this.docentesCarga = [];
          this.estadisticasCarga = null;
        }
      });
  }

  /**
   * Refrescar los datos del informe
   */
  refrescarInformeCarga(): void {
    this.docentesCarga = [];
    this.estadisticasCarga = null;
    // Actualizar fecha al refrescar
    this.fechaUltimaActualizacion = new Date().toLocaleString();
    this.cargarInformeCarga();
  }

  /**
   * Calcular estadísticas localmente
   */
  private calcularEstadisticas(): void {
    if (this.docentesCarga.length === 0) {
      this.estadisticasCarga = null;
      return;
    }

    const totalDocentes = this.docentesCarga.length;
    const docentesActivos = this.docentesCarga.filter(d => d.estado === 'Activo');
    const docentesInactivos = this.docentesCarga.filter(d => d.estado === 'Inactivo');
    
    const totalMaterias = this.docentesCarga.reduce((sum, d) => sum + d.cantidadMaterias, 0);
    const totalEstudiantes = this.docentesCarga.reduce((sum, d) => sum + d.cantidadEstudiantes, 0);
    
    const totalMateriasActivos = docentesActivos.reduce((sum, d) => sum + d.cantidadMaterias, 0);
    const totalEstudiantesActivos = docentesActivos.reduce((sum, d) => sum + d.cantidadEstudiantes, 0);

    this.estadisticasCarga = {
      totalDocentes,
      docentesActivos: docentesActivos.length,
      docentesInactivos: docentesInactivos.length,
      totalMaterias,
      totalEstudiantes,
      promedioMateriasActivos: docentesActivos.length > 0 ? 
        Math.round((totalMateriasActivos / docentesActivos.length) * 100) / 100 : 0,
      promedioEstudiantesActivos: docentesActivos.length > 0 ? 
        Math.round((totalEstudiantesActivos / docentesActivos.length) * 100) / 100 : 0
    };

    console.log('Estadísticas calculadas:', this.estadisticasCarga);
  }

  /**
   * Obtener color para el badge de estado
   */
  getEstadoBadgeClass(estado: string): string {
    return estado === 'Activo' ? 'bg-success' : 'bg-secondary';
  }

  /**
   * Obtener el departamento más frecuente
   */
  getDepartamentoMasFrecuente(): string {
    if (this.docentesCarga.length === 0) return 'N/A';
    
    const departamentos = this.docentesCarga
      .filter(d => d.departamento)
      .map(d => d.departamento!);
    
    if (departamentos.length === 0) return 'N/A';
    
    const conteo = departamentos.reduce((acc, dept) => {
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(conteo)
      .sort(([,a], [,b]) => b - a)[0][0];
  }

  // MÉTODOS DEL FORMULARIO CRUD (mantener los existentes)

  // Método principal para guardar (crear o actualizar)
  guardarDocente(): void {
    if (this.docenteForm.valid) {
      const docenteData = this.docenteForm.value;
      
      if (this.editandoDocente && this.docenteEditandoId !== null) {
        this.actualizarDocente(docenteData);
      } else {
        this.crearDocente(docenteData);
      }
    } else {
      this.marcarCamposComoTocados();
    }
  }

  // Método original onSubmit (mantener compatibilidad)
  onSubmit() {
    this.guardarDocente();
  }

  // Crear nuevo docente
  private crearDocente(docenteData: any): void {
    const nuevoDocente: DocenteModel = {
      id: this.generarNuevoId(),
      name: docenteData.name,
      email: docenteData.email,
      legajo: docenteData.legajo,
      estado: docenteData.estado
    };

    this.docentes.push(nuevoDocente);
    this.resetearFormulario();
    console.log('Docente creado:', nuevoDocente);
  }

  // Actualizar docente existente
  private actualizarDocente(docenteData: any): void {
    const index = this.docentes.findIndex(d => d.id === this.docenteEditandoId);
    if (index !== -1) {
      this.docentes[index] = {
        ...this.docentes[index],
        name: docenteData.name,
        email: docenteData.email,
        legajo: docenteData.legajo,
        estado: docenteData.estado
      };
      
      this.cancelarEdicion();
      console.log('Docente actualizado:', this.docentes[index]);
    }
  }

  // Editar docente (método original)
  editDocente(index: number) {
    this.isEditing = true;
    this.editingIndex = index;
    const docente = this.docentes[index];
    this.docenteForm.patchValue(docente);
    
    // También actualizar las nuevas propiedades
    this.editandoDocente = true;
    this.docenteEditandoId = docente.id;
  }

  // Editar docente (método nuevo para la tabla)
  editarDocente(docente: DocenteModel): void {
    this.editandoDocente = true;
    this.docenteEditandoId = docente.id;
    
    // También actualizar las propiedades originales
    this.isEditing = true;
    this.editingIndex = this.docentes.findIndex(d => d.id === docente.id);
    
    this.docenteForm.patchValue({
      name: docente.name,
      email: docente.email,
      legajo: docente.legajo,
      estado: docente.estado
    });
  }

  // Eliminar docente (método original)
  deleteDocente(index: number) {
    this.docentes.splice(index, 1);
  }

  // Eliminar docente (método nuevo para la tabla)
  eliminarDocente(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este docente?')) {
      this.docentes = this.docentes.filter(d => d.id !== id);
      console.log('Docente eliminado con ID:', id);
    }
  }

  // Cancelar edición (método original)
  cancelEdit() {
    this.isEditing = false;
    this.editingIndex = -1;
    this.docenteForm.reset();
    this.docenteForm.patchValue({ estado: 'Activo' });
    
    // También resetear las nuevas propiedades
    this.editandoDocente = false;
    this.docenteEditandoId = null;
  }

  // Cancelar edición (método nuevo)
  cancelarEdicion(): void {
    this.cancelEdit();
  }

  // Validadores para el template
  campoEsInvalido(campo: string): boolean {
    const control = this.docenteForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  obtenerMensajeError(campo: string): string {
    const control = this.docenteForm.get(campo);
    
    if (control?.errors) {
      if (control.errors['required']) {
        return `${this.getNombreCampo(campo)} es requerido`;
      }
      if (control.errors['email']) {
        return 'Ingrese un email válido';
      }
      if (control.errors['minlength']) {
        return `${this.getNombreCampo(campo)} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
      }
    }
    
    return '';
  }

  private getNombreCampo(campo: string): string {
    const nombres: { [key: string]: string } = {
      'name': 'Nombre',
      'email': 'Email',
      'legajo': 'Legajo',
      'estado': 'Estado'
    };
    return nombres[campo] || campo;
  }

  // Métodos auxiliares
  private resetearFormulario(): void {
    this.docenteForm.reset({
      estado: 'Activo'
    });
    this.editandoDocente = false;
    this.docenteEditandoId = null;
    this.isEditing = false;
    this.editingIndex = -1;
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.docenteForm.controls).forEach(key => {
      this.docenteForm.get(key)?.markAsTouched();
    });
  }

  private generarNuevoId(): number {
    return this.docentes.length > 0 ? Math.max(...this.docentes.map(d => d.id)) + 1 : 1;
  }

  private cargarDocentesIniciales(): void {
    this.docentes = [
      { id: 1, name: 'Juan Pérez', email: 'juan@ejemplo.com', legajo: 'DOC001', estado: 'Activo' },
      { id: 2, name: 'María García', email: 'maria@ejemplo.com', legajo: 'DOC002', estado: 'Activo' },
      { id: 3, name: 'Carlos López', email: 'carlos@ejemplo.com', legajo: 'DOC003', estado: 'Inactivo' }
    ];
  }

  /**
   * Track by function para optimizar el renderizado de la tabla
   */
  trackByDocenteId(index: number, docente: DocenteCarga): number {
    return docente.id;
  }

  /**
   * Obtener la fecha actual formateada
   */
  get fechaActual(): string {
    return new Date().toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}