import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginData = {
    email: '',
    password: ''
  };

  onLogin(form: any) {
    if (form.valid) {
      console.log('Login data:', this.loginData);
      // Aquí iría la lógica de autenticación
    }
  }
}
