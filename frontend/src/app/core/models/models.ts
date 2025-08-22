import { Component } from '@angular/core';

@Component({
  selector: 'app-models',
  imports: [],
  templateUrl: './models.html',
  styleUrl: './models.css'
})
export interface Docente {
  id: number;
  name: string;
  email: string;
  legajo: string;
  estado: string;
}
