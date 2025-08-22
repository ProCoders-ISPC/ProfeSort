import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { About } from '../../about/about';
import { Hero } from './components/hero/hero';
import { Footer } from './components/footer/footer';
import { Contact } from '../../contact/contact';
import { Portfolio } from './components/portfolio/portfolio';
import { Technologies } from './components/technologies/technologies';
import { Header } from './components/header/header';


@Component({
  selector: 'app-laura-zarate',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, Hero, About, Contact, Portfolio, Technologies],
  templateUrl: './laura-zarate.html',
  styleUrls: ['./laura-zarate.css']
})
export class LauraZarate implements OnInit {
  

  profileData = {
    name: 'LAURA ZARATE',
    title: 'Desarrolladora Web - Diseñadora',
    image: 'assets/img_lau.png',
    cv: 'assets/Mi_CV.pdf'
  };

  technologies = [
    { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' },
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
    { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
    { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
    { name: 'Bootstrap', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
    { name: 'Angular', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg' }
  ];

  ngOnInit() {

    this.initializePortfolio();
  }

 
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private initializePortfolio() {

    console.log('Portfolio de Laura Zarate inicializado');
  }


  downloadCV() {
    window.open(this.profileData.cv, '_blank');
  }
}