import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminDocenteService, DocenteCarga } from 'src/app/core/services/admindocente.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-admindocente',
  templateUrl: './admindocente.html',
  styleUrls: ['./admindocente.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AdminDocente implements OnInit {
  docentes: DocenteCarga[] = [];
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
  
  constructor(private adminDocenteService: AdminDocenteService) {}
  
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
    this.adminDocenteService.getDocentesCarga(
      this.terminoBusqueda,
      this.estadoFiltro,
      this.areaFiltro,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (data) => {
        this.docentes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar docentes:', err);
        this.error = 'Error al cargar docentes';
        this.loading = false;
      }
    });
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
    this.adminDocenteService.asignarRolDocente(usuarioId).subscribe({
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
  
  asignarMateria(docenteId: number): void {
    console.log('Asignar materias al docente:', docenteId);
  }
  
  mostrarMensaje(texto: string): void {
    this.mensaje = texto;
    setTimeout(() => this.mensaje = '', 3000);
  }
  
  // Método para manejar input de búsqueda
  onSearch(term: string): void {
    this.searchTerms.next(term);
  }
  
  buscarDocentes(): void {
    this.currentPage = 1; // Reiniciar a primera página
    this.cargarDocentes();
  }
  
  // Filtros de búsqueda
  filtrarPorEstado(estado: string): void {
    this.estadoFiltro = estado;
    this.buscarDocentes();
  }

  filtrarPorArea(area: string): void {
    this.areaFiltro = area;
    this.buscarDocentes();
  }
  
  // Paginación
  cambiarPagina(pagina: number): void {
    this.currentPage = pagina;
    this.cargarDocentes();
  }
}
