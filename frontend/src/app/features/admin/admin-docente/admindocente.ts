import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDocenteService, DocenteCarga } from '../../../core/services/admindocente.service';

@Component({
  selector: 'app-admindocente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admindocente.html',
  styleUrls: ['./admindocente.css']
})
export class AdminDocente implements OnInit {

  math = Math; 
  
  // Lista de docentes
  docentes: DocenteCarga[] = [];
  filteredDocentes: DocenteCarga[] = [];
  
  // Docente seleccionado para editar
  docenteSeleccionado: DocenteCarga | null = null;
  nuevoDocente: Partial<DocenteCarga> = {};
  modoEdicion: boolean = false;
  
  // Estados de UI
  loading: boolean = false;
  error: string | null = null;
  
  // Parámetros de búsqueda
  terminoBusqueda: string = '';
  filtroEstado: string = '';
  filtroDepartamento: string = '';
  
  // Paginación
  paginaActual: number = 1;
  totalItems: number = 0;
  itemsPorPagina: number = 10;

  constructor(private adminDocenteService: AdminDocenteService) { }

  ngOnInit(): void {
    this.cargarDocentes();
  }

  cargarDocentes(): void {
    this.loading = true;
    this.error = null;
    
    this.adminDocenteService.getDocentesCarga(
      this.terminoBusqueda,
      this.filtroEstado,
      this.filtroDepartamento,
      this.paginaActual,
      this.itemsPorPagina
    ).subscribe({
      next: (data) => {
        this.docentes = data;
        this.filteredDocentes = [...data]; 
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar docentes:', err);
        this.error = 'No se pudieron cargar los docentes. Por favor intente nuevamente.';
        this.loading = false;
      }
    });
    

    this.adminDocenteService.getEstadisticas().subscribe({
      next: (stats) => {
        this.totalItems = stats.totalDocentes;
      },
      error: () => {} 
    });
  }
  

  busquedaRapida(termino: string): void {
    termino = termino.toLowerCase().trim();
    
    if (!termino) {
      this.filteredDocentes = [...this.docentes];
      return;
    }
    
    this.filteredDocentes = this.docentes.filter(docente => 
      docente.nombre.toLowerCase().includes(termino) || 
      docente.email.toLowerCase().includes(termino) || 
      docente.legajo.toLowerCase().includes(termino)
    );
  }
  
 
  busquedaCompleta(): void {
    this.paginaActual = 1; 
    this.cargarDocentes();
  }
  
  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
    this.cargarDocentes();
  }
  
  seleccionarDocente(docente: DocenteCarga): void {
    this.docenteSeleccionado = {...docente};
    this.modoEdicion = true;
  }
  
  crearDocente(): void {
    if (!this.validarDocente(this.nuevoDocente)) {
      return;
    }
    
    this.loading = true;
    
   
    const docenteParaEnviar = {
      name: this.nuevoDocente.nombre,
      email: this.nuevoDocente.email,
      legajo: this.nuevoDocente.legajo,
      password: 'password123',
      role_id: 2,
      fecha_ingreso: this.nuevoDocente.fechaIngreso,
      area: this.nuevoDocente.departamento,  
      is_active: true                        
    };
    
    console.log('Enviando datos:', docenteParaEnviar); 
    
    this.adminDocenteService.crearDocente(docenteParaEnviar).subscribe({
      next: () => {
        this.loading = false;
        this.nuevoDocente = {};
        this.cargarDocentes();
        alert('Docente creado correctamente');
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al crear docente:', err);
        alert('Error al crear el docente');
      }
    });
  }
  
  actualizarDocente(): void {
    if (!this.docenteSeleccionado || !this.validarDocente(this.docenteSeleccionado)) {
      return;
    }
    
    this.loading = true;
    
    this.adminDocenteService.actualizarDocente(
      this.docenteSeleccionado.id,
      this.docenteSeleccionado
    ).subscribe({
      next: () => {
        this.loading = false;
        this.cancelarEdicion();
        this.cargarDocentes();
        alert('Docente actualizado correctamente');
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al actualizar docente:', err);
        alert('Error al actualizar el docente');
      }
    });
  }
  
  eliminarDocente(id: number): void {
    if (!confirm('¿Está seguro de eliminar este docente?')) {
      return;
    }
    
    this.loading = true;
    
    this.adminDocenteService.eliminarDocente(id).subscribe({
      next: () => {
        this.loading = false;
        this.cargarDocentes();
        alert('Docente eliminado correctamente');
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al eliminar docente:', err);
        alert('Error al eliminar el docente');
      }
    });
  }
  
  cancelarEdicion(): void {
    this.docenteSeleccionado = null;
    this.modoEdicion = false;
  }
  
  validarDocente(docente: Partial<DocenteCarga>): boolean {
    if (!docente.nombre || docente.nombre.trim() === '') {
      alert('El nombre es obligatorio');
      return false;
    }
    
    if (!docente.email || docente.email.trim() === '') {
      alert('El email es obligatorio');
      return false;
    }
    
    if (!docente.legajo || docente.legajo.trim() === '') {
      alert('El legajo es obligatorio');
      return false;
    }
    
    return true;
  }
  
  limpiarFiltros(): void {
    this.terminoBusqueda = '';
    this.filtroEstado = '';
    this.filtroDepartamento = '';
    this.busquedaCompleta();
  }
  
  // Método auxiliar para calcular el total de páginas (alternativa)
  getTotalPaginas(): number {
    return Math.ceil(this.totalItems / this.itemsPorPagina);
  }
}