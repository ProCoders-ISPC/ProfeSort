import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminDocenteService, DocenteCarga } from 'src/app/core/services/admindocente.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-admindocente',
  templateUrl: './admindocente-nuevo.html',
  styleUrls: ['./admindocente-nuevo.css'],
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
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      domicilio: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      legajo: ['', Validators.required],
      area: [''],
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
        docente.nombre.toLowerCase().includes(termino) ||
        docente.email.toLowerCase().includes(termino) ||
        docente.legajo.toLowerCase().includes(termino)
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
    
    // Separar nombre completo en nombre y apellido si es necesario
    const nombreCompleto = docente.nombre.split(' ');
    const nombre = nombreCompleto[0] || '';
    const apellido = nombreCompleto.slice(1).join(' ') || '';
    
    this.formularioEdicion.patchValue({
      nombre: nombre,
      apellido: apellido,
      dni: (docente as any).dni || '',
      fechaNacimiento: (docente as any).fechaNacimiento || '',
      domicilio: (docente as any).domicilio || '',
      telefono: (docente as any).telefono || '',
      email: docente.email,
      legajo: docente.legajo,
      area: docente.area || '',
      estado: docente.estado
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

  guardarCambios(): void {
    if (this.formularioEdicion.valid && this.docenteEditando) {
      this.guardandoCambios = true;
      this.errorModal = '';
      
      const formValues = this.formularioEdicion.value;
      
      // Combinar nombre y apellido
      const nombreCompleto = `${formValues.nombre} ${formValues.apellido}`.trim();
      
      const datosActualizados = {
        ...this.docenteEditando,
        nombre: nombreCompleto,
        email: formValues.email,
        legajo: formValues.legajo,
        dni: formValues.dni,
        fechaNacimiento: formValues.fechaNacimiento,
        domicilio: formValues.domicilio,
        telefono: formValues.telefono,
        area: formValues.area,
        estado: formValues.estado
      };

      console.log('Guardando cambios del docente:', datosActualizados);
      
      // Simulación de guardado (reemplazar con servicio real)
      setTimeout(() => {
        // Actualizar en la lista local
        const index = this.docentesOriginales.findIndex(d => d.id === this.docenteEditando!.id);
        if (index !== -1) {
          this.docentesOriginales[index] = { ...datosActualizados };
          this.aplicarFiltros(); // Reaplica filtros con los nuevos datos
        }
        
        this.mensajeModal = 'Información del docente actualizada correctamente';
        this.guardandoCambios = false;
        
        // Cerrar modal después de 2 segundos
        setTimeout(() => {
          this.cerrarModal();
          this.mostrarMensaje('Docente actualizado correctamente');
        }, 2000);
      }, 1000);
    } else {
      this.errorModal = 'Por favor, complete todos los campos requeridos';
    }
  }
  
  mostrarMensaje(texto: string): void {
    this.mensaje = texto;
    setTimeout(() => this.mensaje = '', 3000);
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