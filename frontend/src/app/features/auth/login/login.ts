import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackToHomeButtonComponent } from '../../../shared/components/buttons/back-to-home-button/back-to-home-button';
import { BackgroundComponent } from '../../../shared/components/background/background';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, BackToHomeButtonComponent, BackgroundComponent,],
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
        // Aquí iría la lógica  de autenticación con el backend
        console.log('Login exitoso, redirigiendo a home...');
        
        // Navega a home
        this.router.navigate(['/home']);
      } else {
        alert('Por favor complete todos los campos');
      }
    } else {
      alert('Por favor complete el formulario correctamente');
    }
  }
}
