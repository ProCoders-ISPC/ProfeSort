import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-daniel-paez',
  imports: [CommonModule, RouterLink],
  templateUrl: './daniel-paez.html',
  styleUrls: ['./daniel-paez.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class DanielPaezComponent {
}
