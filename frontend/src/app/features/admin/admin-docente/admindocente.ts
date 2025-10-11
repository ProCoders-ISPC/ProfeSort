import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminDocenteService, DocenteCarga } from 'src/app/core/services/admindocente.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-admindocente',
  templateUrl: './admindocente.html',
  styleUrls: ['./admindocente.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class AdminDocenteComponent implements OnInit {
  docentes: DocenteCarga[] = [];
  docentesOriginales: DocenteCarga[] = [];
  usuariosRegulares: any[] = [];
  loading = false;
  error = '';
  mensaje = '';
  
  // Estado de vista
  mostrarUsuariosRegulares = false;
  
  // Propiedades para búsqueda
  terminoBusqueda = '';
  estadoFiltro = '';
  areaFiltro = '';
  searchTerms = new Subject<string>();
  
  // Paginación
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  
  // Propiedades para el modal de edición
  mostrarModalEdicion = false;
  docenteEditando: DocenteCarga | null = null;
  formularioEdicion: FormGroup;
  guardandoCambios = false;
  mensajeModal = '';
  errorModal = '';
  
  
  constructor(
    private adminDocenteService: AdminDocenteService,
    private fb: FormBuilder
  ) {
    this.formularioEdicion = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-ZÀ-ÿ\\u00f1\\u00d1\\s]+$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      legajo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{7,8}$')]],
      fechaNacimiento: ['', [Validators.required]],
      domicilio: ['', [Validators.required, Validators.minLength(5)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      estado: ['Activo', Validators.required]
    });
  }
  
  ngOnInit(): void {
    // Configurar búsqueda con debounce
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.terminoBusqueda = term;
      this.buscarDocentes();
    });
    
    this.cargarDocentes();
  }
  
  cargarDocentes(): void {
    this.loading = true;
    this.adminDocenteService.getDocentesCarga().subscribe({
      next: (data) => {
        this.docentesOriginales = data;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar docentes:', err);
        this.error = 'Error al cargar docentes';
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    let docentesFiltrados = [...this.docentesOriginales];

    // Filtro por término de búsqueda
    if (this.terminoBusqueda) {
      const termino = this.terminoBusqueda.toLowerCase();
      docentesFiltrados = docentesFiltrados.filter(docente =>
        docente.name.toLowerCase().includes(termino) ||
        docente.email.toLowerCase().includes(termino) ||
        docente.legajo.toLowerCase().includes(termino) ||
        docente.dni.toLowerCase().includes(termino)
      );
    }

    // Filtro por estado
    if (this.estadoFiltro) {
      docentesFiltrados = docentesFiltrados.filter(docente =>
        docente.estado === this.estadoFiltro
      );
    }

    // Filtro por área
    if (this.areaFiltro) {
      docentesFiltrados = docentesFiltrados.filter(docente =>
        docente.area === this.areaFiltro
      );
    }

    this.docentes = docentesFiltrados;
  }
  
  cargarUsuariosRegulares(): void {
    this.loading = true;
    this.adminDocenteService.getUsuariosRegulares().subscribe({
      next: (data) => {
        this.usuariosRegulares = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.error = 'Error al cargar usuarios';
        this.loading = false;
      }
    });
  }
  
  asignarRolDocente(usuarioId: number): void {
    this.loading = true;
    this.adminDocenteService.asignarRol(usuarioId, this.adminDocenteService.ROL_DOCENTE).subscribe({
      next: () => {
        this.mensaje = 'Usuario convertido a docente correctamente';
        this.cargarUsuariosRegulares();
        this.cargarDocentes();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al asignar rol:', err);
        this.error = 'Error al asignar rol de docente';
        this.loading = false;
      }
    });
  }
  
  toggleMostrarUsuarios(): void {
    this.mostrarUsuariosRegulares = !this.mostrarUsuariosRegulares;
    if (this.mostrarUsuariosRegulares) {
      this.cargarUsuariosRegulares();
    }
  }
  
  editarDocente(docente: DocenteCarga): void {
    this.docenteEditando = { ...docente }; // Crear una copia
    
    // Usar el nombre completo directamente de la base de datos
    this.formularioEdicion.patchValue({
      nombre: docente.name || '',
      dni: docente.dni,
      fechaNacimiento: docente.fecha_nacimiento,
      domicilio: docente.domicilio,
      telefono: docente.telefono,
      email: docente.email,
      legajo: docente.legajo,
      estado: docente.estado || 'Activo'
    });
    this.mostrarModalEdicion = true;
    this.mensajeModal = '';
    this.errorModal = '';
  }

  cerrarModal(): void {
    this.mostrarModalEdicion = false;
    this.docenteEditando = null;
    this.formularioEdicion.reset();
    this.mensajeModal = '';
    this.errorModal = '';
  }

  cancelarEdicion(): void {
    this.docenteEditando = null;
    this.formularioEdicion.reset();
    this.errorModal = '';
  }

  actualizarDocente(): void {
    this.guardarCambios();
  }

  guardarCambios(): void {
    // Marcar todos los campos como touched para mostrar errores
    Object.keys(this.formularioEdicion.controls).forEach(key => {
      this.formularioEdicion.get(key)?.markAsTouched();
    });

    if (this.formularioEdicion.valid && this.docenteEditando) {
      this.guardandoCambios = true;
      this.errorModal = '';
      
      const formValues = this.formularioEdicion.value;
      
      const datosActualizados = {
        name: formValues.nombre,
        email: formValues.email,
        legajo: formValues.legajo,
        dni: formValues.dni,
        fecha_nacimiento: formValues.fechaNacimiento,
        domicilio: formValues.domicilio,
        telefono: formValues.telefono,
        is_active: formValues.estado === 'Activo'
      };

      console.log('Formulario válido:', this.formularioEdicion.valid);
      console.log('Datos del formulario:', formValues);
      console.log('Docente editando:', this.docenteEditando);
      console.log('Datos actualizados a enviar:', datosActualizados);
      
      // Usar el servicio real para actualizar
      this.adminDocenteService.actualizarDocente(this.docenteEditando!.id, datosActualizados).subscribe({
        next: (response) => {
          console.log('Docente actualizado exitosamente:', response);
          
          // Actualizar en la lista local con la respuesta del servidor
          const index = this.docentesOriginales.findIndex(d => d.id === this.docenteEditando!.id);
          if (index !== -1) {
            // Combinar la respuesta con los datos anteriores para asegurar que no falte nada
            const docenteActualizado: DocenteCarga = {
              ...this.docentesOriginales[index],  // Mantener datos anteriores
              ...response,                         // Actualizar con la respuesta del servidor
              name: response.name || datosActualizados.name || this.docentesOriginales[index].name,  // Asegurar que name existe
              estado: response.is_active ? 'Activo' : 'Inactivo'
            };
            this.docentesOriginales[index] = docenteActualizado;
            this.aplicarFiltros(); // Reaplica filtros con los nuevos datos
          }
          
          this.mensajeModal = 'Información del docente actualizada correctamente';
          this.guardandoCambios = false;
          
          // Cerrar modal después de 2 segundos
          setTimeout(() => {
            this.cerrarModal();
            this.mostrarMensaje('Docente actualizado correctamente');
          }, 2000);
        },
        error: (error) => {
          console.error('Error al actualizar docente:', error);
          this.errorModal = 'Error al guardar los cambios. Inténtalo de nuevo.';
          this.guardandoCambios = false;
        }
      });
    } else {
      this.errorModal = 'Por favor, complete todos los campos requeridos';
    }
  }
  
  mostrarMensaje(texto: string): void {
    this.mensaje = texto;
    setTimeout(() => this.mensaje = '', 3000);
  }

  // Método para obtener errores de campos del formulario
  getFieldError(fieldName: string): string {
    const field = this.formularioEdicion.get(fieldName);
    
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `Este campo es obligatorio`;
      if (field.errors['email']) return `Ingrese un correo electrónico válido`;
      if (field.errors['minlength']) return `Debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) {
        if (fieldName === 'dni') return 'El DNI debe contener solo números (7-8 dígitos)';
        if (fieldName === 'telefono') return 'El teléfono debe contener solo números (10-15 dígitos)';
      }
    }
    
    return '';
  }

  // Método para verificar si un campo tiene errores
  hasFieldError(fieldName: string): boolean {
    const field = this.formularioEdicion.get(fieldName);
    return !!(field && field.errors && field.touched);
  }
  

  onSearch(term: string): void {
    this.searchTerms.next(term);
  }
  
  buscarDocentes(): void {
    this.aplicarFiltros();
  }
  

  filtrarPorEstado(estado: string): void {
    this.estadoFiltro = estado;
    this.aplicarFiltros();
  }

  filtrarPorArea(area: string): void {
    this.areaFiltro = area;
    this.aplicarFiltros();
  }
  

  cambiarPagina(pagina: number): void {
    this.currentPage = pagina;
    this.cargarDocentes();
  }


  promoverAAdmin(docenteId: number, nombreDocente: string): void {

    if(confirm(`⚠️ ADVERTENCIA: Estás por promover a "${nombreDocente}" a ADMINISTRADOR.\n\nEsto otorgará acceso completo al sistema. ¿Estás seguro?`)) {
      this.loading = true;
      
      this.adminDocenteService.asignarRol(docenteId, this.adminDocenteService.ROL_ADMIN).subscribe({
        next: () => {
          this.mensaje = `✅ Docente "${nombreDocente}" promovido a Administrador correctamente`;
          this.cargarDocentes(); 
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al promover a admin:', err);
          this.error = '❌ Error al promover a administrador: ' + 
                      (err.error?.error || 'Intente nuevamente');
          this.loading = false;
        }
      });
    }
  }
}