import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MateriasService, Materia } from '../../../core/services/materias.service';
import { AuthService } from '../../../core/services/services';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './materias.html',
  styleUrl: './materias.css'
})
export class Materias implements OnInit {
  materias: Materia[] = [];
  loading = false;
  error = '';
  userName = '';

  constructor(
    private materiasService: MateriasService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.userName = user?.name || 'Docente';
    this.cargarMaterias();
  }

  cargarMaterias() {
    this.loading = true;
    this.error = '';
    
    this.materiasService.getMaterias().subscribe({
      next: (materias) => {
        this.materias = materias;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las materias';
        this.loading = false;
      }
    });
  }
}
