import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { Hero } from '../hero';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];
  currentOffset: number = 0;  
  limit: number = 20;        

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes(this.currentOffset, this.limit)
      .subscribe(heroes => this.heroes = heroes);
  }

  //Metodos para cambiar de paginas

  nextPage(): void {
    this.currentOffset += this.limit; //Pedir los 20 siguientes heroes
    this.getHeroes(); //Volver a cargar los héroes con el nuevo offset
  }

  prevPage(): void {
    if (this.currentOffset > 0) {  // no deja desplazar antes de la primera pagina
      this.currentOffset -= this.limit; // Reducir el offset para la página anterior
      this.getHeroes(); 
    }
  }

 


 
}
