import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BackToHomeButtonComponent } from '../../../shared/components/buttons/back-to-home-button/back-to-home-button';
import { BackgroundComponent } from '../../../shared/components/background/background';
import { AuthService } from '../../../core/services/services';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule, BackToHomeButtonComponent, BackgroundComponent],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  isSubmitted = false;
  isLoading = false;
  loginError = '';
  loginMessage = '';

  constructor(
    private router: Router, 
    private formBuilder: FormBuilder, 
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  // Método para obtener errores de un campo
  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
    if (field && field.errors && (field.touched || this.isSubmitted)) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} es obligatorio`;
      if (field.errors['pattern'] && fieldName === 'email') return 'Ingrese un correo electrónico válido';
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: 'El correo electrónico',
      password: 'La contraseña'
    };
    return labels[fieldName] || 'El campo';
  }

  // Verificar si un campo tiene errores
  hasFieldError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.errors && (field.touched || this.isSubmitted));
  }

  onLogin(): void {
    this.isSubmitted = true;
    this.loginError = '';
    this.loginMessage = '';
    
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          if (response.success && response.data) {
            this.loginMessage = 'Inicio de sesión exitoso. Redirigiendo...';
            
            // Redirección dinámica según el rol
            setTimeout(() => {
              if (response.data?.role === 'Admin') {
                this.router.navigate(['/admin']);
              } else if (response.data?.role === 'User') {
                this.router.navigate(['/docente']);
              } else {
                // Fallback por si no tiene rol específico
                this.router.navigate(['/home']);
              }
            }, 1000);
          } else {
            this.loginError = response.error || response.message || 'Error en el inicio de sesión';
            console.error('Error en login:', response);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.loginError = 'Error de conexión. Por favor, intente nuevamente.';
          console.error('Error de conexión:', error);
        }
      });
    } else {
      console.log('Formulario inválido');
      // Marcar todos los campos como touched para mostrar los errores
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }
}
