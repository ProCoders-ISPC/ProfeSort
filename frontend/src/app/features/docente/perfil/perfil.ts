import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, AuthUser } from '../../../core/services/services';

@Component({
  selector: 'app-docente-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class DocentePerfil implements OnInit {
  currentUser: AuthUser | null = null;
  perfilForm: FormGroup;
  modoEdicion = false;
  mensaje = '';
  error = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.perfilForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      legajo: [{ value: '', disabled: true }]
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.perfilForm.patchValue({
          name: user.name,
          email: user.email,
          legajo: user.legajo || 'N/A'
        });
      }
    });
  }

  toggleEdicion() {
    this.modoEdicion = !this.modoEdicion;
    this.mensaje = '';
    this.error = '';
    
    if (!this.modoEdicion && this.currentUser) {
      this.perfilForm.patchValue({
        name: this.currentUser.name
      });
    }
  }

  guardarCambios() {
    if (this.perfilForm.valid && this.currentUser) {
      const updatedUser = {
        ...this.currentUser,
        name: this.perfilForm.get('name')?.value
      };
      
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.authService['currentUserSubject'].next(updatedUser);
      
      this.mensaje = 'Perfil actualizado correctamente';
      this.modoEdicion = false;
      
      setTimeout(() => {
        this.mensaje = '';
      }, 3000);
    }
  }
}
