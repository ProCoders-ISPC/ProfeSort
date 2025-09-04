import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, ReactiveFormsModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class AdminLayout { }
