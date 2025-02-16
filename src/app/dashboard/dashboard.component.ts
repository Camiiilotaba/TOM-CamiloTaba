import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = []; 
  searchTerm: string = ''; // Propiedad para almacenar el término de búsqueda
  private searchTerms = new Subject<string>(); //emitir terminos de busqueda

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.getHeroes(); 

    // Establecer la lógica de búsqueda
    this.searchTerms.pipe(
      debounceTime(100), 
      distinctUntilChanged(), // solo busca si ha cambiado el texto
      switchMap((term: string) => this.heroService.searchHeroes(term)) // Cambia al nuevo término de búsqueda
    ).subscribe(heroes => this.heroes = heroes); // subscribirse a los heroes
  }

  // Método para obtener héroes aleatorios
  getHeroes(): void {
    const randomOffset = Math.floor(Math.random() * 100); 
    this.heroService.getHeroes(randomOffset, 5) // obtener 5 heroes aleatorios
      .subscribe(heroes => this.heroes = heroes); // Asignar heroes
  }

  // Método para buscar heroes
  search(term: string): void {
    this.searchTerms.next(term); 
  }
}
