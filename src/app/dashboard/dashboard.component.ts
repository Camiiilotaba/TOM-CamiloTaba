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
  searchTerm: string = '';
  private searchTerms = new Subject<string>(); //emitir terminos de busqueda

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.getHeroes(); 

    
    this.searchTerms.pipe(
      debounceTime(100), 
      distinctUntilChanged(), // solo busca si ha cambiado el texto
      switchMap((term: string) => this.heroService.searchHeroes(term)) 
    ).subscribe(heroes => this.heroes = heroes); //subscribirse a los heroes
  }

  getHeroes(): void {
    const randomOffset = Math.floor(Math.random() * 1500); 
    this.heroService.getHeroes(randomOffset, 10) //obtener 10 heroes aleatorios
      .subscribe(heroes => this.heroes = heroes);
  }

  search(term: string): void {
    this.searchTerms.next(term); 
  }
}
