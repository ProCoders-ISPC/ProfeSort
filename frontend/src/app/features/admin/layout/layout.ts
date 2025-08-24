import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class AdminLayout { }
