import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class ContactComponent {
  onSubmit() {
    console.log('Formulario enviado!');
  }
}
