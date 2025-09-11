import { Component } from '@angular/core';

@Component({
  selector: 'app-juanpablo-sanchez',
  imports: [],
  templateUrl: './juanpablo-sanchez.html',
  styleUrls: ['./juanpablo-sanchez.css']
})
export class JuanpabloSanchez {
  scrollTo(section: string) {
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
