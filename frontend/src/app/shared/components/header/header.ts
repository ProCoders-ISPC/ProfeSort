import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavComponent } from '../nav/nav';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, NavComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {}
