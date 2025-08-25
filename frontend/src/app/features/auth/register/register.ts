import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BackToHomeButtonComponent } from '../../../shared/components/buttons/back-to-home-button/back-to-home-button';
import { BackgroundComponent } from '../../../shared/components/background/background';

@Component({
  selector: 'app-register',
  imports: [BackToHomeButtonComponent, BackgroundComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: FormGroup;
  isSubmitted = false;

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      nombre: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.pattern('^[a-zA-ZÀ-ÿ\\u00f1\\u00d1\\s]+$') // Solo letras y espacios
      ]],
      apellido: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[a-zA-ZÀ-ÿ\\u00f1\\u00d1\\s]+$')
      ]],
      dni: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{7,8}$') // Solo números, 7-8 dígitos
      ]],
      fechaNacimiento: ['', [
        Validators.required,
        this.validateAge
      ]],
      domicilio: ['', [
        Validators.required,
        Validators.minLength(5)
      ]],
      telefono: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{10,15}$') // Solo números, 10-15 dígitos
      ]],
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]],
      confirmarEmail: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        this.validatePassword
      ]],
      confirmarPassword: ['', [
        Validators.required
      ]],
      legajo: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9]+$')
      ]],
      terminos: [false, [
        Validators.requiredTrue
      ]]
    }, {
      validators: [this.passwordMatchValidator, this.emailMatchValidator]
    });
  }

  // Validador personalizado para la edad (mayor de 16 años)
  validateAge(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const today = new Date();
    const birthDate = new Date(control.value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 16 ? null : { underage: true };
  }

  // Validador personalizado para la contraseña (simplificado)
  validatePassword(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const password = control.value;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    const errors: any = {};

    if (!hasUppercase) errors.noUppercase = true;
    if (!hasNumber) errors.noNumber = true;

    return Object.keys(errors).length ? errors : null;
  }

  // Validador para confirmar contraseña
  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password');
    const confirmarPassword = form.get('confirmarPassword');

    if (!password || !confirmarPassword) return null;

    return password.value === confirmarPassword.value ? null : { passwordMismatch: true };
  }

  // Validador para confirmar email
  emailMatchValidator(form: AbstractControl): ValidationErrors | null {
    const email = form.get('email');
    const confirmarEmail = form.get('confirmarEmail');

    if (!email || !confirmarEmail) return null;

    return email.value === confirmarEmail.value ? null : { emailMismatch: true };
  }

  // Método para obtener errores de un campo
  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    
    if (field && field.errors && (field.touched || this.isSubmitted)) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} es obligatorio`;
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `${this.getFieldLabel(fieldName)} debe tener máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) return this.getPatternError(fieldName);
      if (field.errors['underage']) return 'Debe ser mayor de 16 años';
      if (field.errors['noUppercase']) return 'La contraseña debe contener al menos una mayúscula';
      if (field.errors['noNumber']) return 'La contraseña debe contener al menos un número';
    }

    if (fieldName === 'confirmarPassword' && this.registerForm.errors?.['passwordMismatch'] && (field?.touched || this.isSubmitted)) {
      return 'Las contraseñas no coinciden';
    }

    if (fieldName === 'confirmarEmail' && this.registerForm.errors?.['emailMismatch'] && (field?.touched || this.isSubmitted)) {
      return 'Los correos electrónicos no coinciden';
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nombre: 'El nombre',
      apellido: 'El apellido',
      dni: 'El DNI',
      fechaNacimiento: 'La fecha de nacimiento',
      domicilio: 'El domicilio',
      telefono: 'El teléfono',
      email: 'El correo electrónico',
      confirmarEmail: 'La confirmación del correo electrónico',
      password: 'La contraseña',
      confirmarPassword: 'La confirmación de contraseña',
      legajo: 'El legajo'
    };
    return labels[fieldName] || 'El campo';
  }

  private getPatternError(fieldName: string): string {
    const errors: { [key: string]: string } = {
      nombre: 'El nombre solo puede contener letras y espacios',
      apellido: 'El apellido solo puede contener letras y espacios',
      dni: 'El DNI debe contener solo números (7-8 dígitos)',
      telefono: 'El teléfono debe contener solo números (10-15 dígitos)',
      email: 'Ingrese un correo electrónico válido',
      confirmarEmail: 'Ingrese un correo electrónico válido',
      legajo: 'El legajo solo puede contener letras y números'
    };
    return errors[fieldName] || 'Formato inválido';
  }

  // Verificar si un campo tiene errores
  hasFieldError(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.errors && (field.touched || this.isSubmitted)) || 
           (fieldName === 'confirmarPassword' && this.registerForm.errors?.['passwordMismatch'] && (field?.touched || this.isSubmitted)) ||
           (fieldName === 'confirmarEmail' && this.registerForm.errors?.['emailMismatch'] && (field?.touched || this.isSubmitted));
  }

  // Métodos para verificar requisitos de contraseña
  hasUppercase(): boolean {
    const password = this.registerForm.get('password')?.value || '';
    return /[A-Z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.registerForm.get('password')?.value || '';
    return /\d/.test(password);
  }

  hasMinLength(): boolean {
    const password = this.registerForm.get('password')?.value || '';
    return password.length >= 6;
  }

  // Método para enviar el formulario
  onSubmit(): void {
    this.isSubmitted = true;
    
    if (this.registerForm.valid) {
      console.log('Formulario válido:', this.registerForm.value);
      // Aquí puedes agregar la lógica para enviar los datos al servidor
      alert('Registro exitoso!');
    } else {
      console.log('Formulario inválido');
      // Marcar todos los campos como touched para mostrar los errores
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }
}
