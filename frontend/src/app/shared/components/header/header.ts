import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../nav/nav';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NavComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {}
