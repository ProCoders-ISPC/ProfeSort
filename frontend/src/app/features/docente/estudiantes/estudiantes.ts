import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnConstruccionComponent } from '../../../shared/components/en-construccion/en-construccion.component';

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.html',
  styleUrls: ['./estudiantes.css'],
  imports: [CommonModule, EnConstruccionComponent]
})

export class Estudiantes {
  constructor() {}
}