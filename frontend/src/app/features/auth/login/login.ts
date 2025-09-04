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

  constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService) {
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
    
    if (this.loginForm.valid) {
      const { email,password } = this.loginForm.value;
      
      // Usar AuthService para autenticar
      const loginSuccess = this.authService.login(email, password);

      if(loginSuccess) {
        // Obtener el usuario actual para redirección basada en rol
        const currentUser = this.authService.getCurrentUser();

        if (currentUser?.role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (currentUser?.role === 'teacher'){
          this.router.navigate(['/docente']);
        } else {
          this.router.navigate(['/home']);
        }
        return;
      } else {
        //mostrar error de login
        console.log('Error: Credenciales inavlidas');
        return;
      }
      
      // ESTE CÓDIGO NO DEBERÍA EJECUTARSE DESPUÉS DE LOGIN EXITOSO
      //console.log('Login exitoso, redirigiendo a home...');
      
      // Navega a home
      this.router.navigate(['/home']);
    } else {
      console.log('Formulario inválido');
      // Marcar todos los campos como touched para mostrar los errores
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }
}
