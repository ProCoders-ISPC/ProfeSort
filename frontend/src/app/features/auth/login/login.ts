import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginData = {
    email: '',
    password: ''
  };

  constructor(private router: Router) {}

  onLogin(form: any) {
    if (form.valid) {
      console.log('Login data:', this.loginData);
      
      // Simulación de autenticación básica
      if (this.loginData.email && this.loginData.password) {
        // Aquí iría la lógica real de autenticación con el backend
        console.log('Login exitoso, redirigiendo a home...');
        
        // Navegar a home
        this.router.navigate(['/home']);
      } else {
        alert('Por favor complete todos los campos');
      }
    } else {
      alert('Por favor complete el formulario correctamente');
    }
  }
}
