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
    // Llamamos al servicio con el offset y limit para la paginación
    this.heroService.getHeroes(this.currentOffset, this.limit)
      .subscribe(heroes => this.heroes = heroes);
  }

  // Metodos para cambiar de paginas


  nextPage(): void {
    this.currentOffset += this.limit; // Pedir los 20 siguientes heroes
    this.getHeroes(); // Volver a cargar los héroes con el nuevo offset
  }

  prevPage(): void {
    if (this.currentOffset > 0) {  // no deja desplazar antes de la primera pagina
      this.currentOffset -= this.limit; // Reducir el offset para la página anterior
      this.getHeroes(); // Volver a  hacer la carga de heroes
    }
  }

 
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }
}
