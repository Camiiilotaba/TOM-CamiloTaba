import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Hero } from './hero';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class HeroService {

  private marvelApiUrl = 'https://gateway.marvel.com/v1/public/characters';
  private ts = 'patata';
  private apiKey = '3461bdde54fe3d07ba591abc049009a8';
  private hash = '5c5ffa08d46a9e2b1cd1c9fb0545a2aa';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET heroes from Marvel API */
  getHeroes(offset: number = 0, limit: number = 20): Observable<Hero[]> {
    const url = `${this.marvelApiUrl}?ts=${this.ts}&apikey=${this.apiKey}&hash=${this.hash}&offset=${offset}&limit=${limit}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => response.data.results),
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

/** GET hero by id */
getHero(id: number): Observable<Hero> {
  const url = `${this.marvelApiUrl}/${id}?ts=${this.ts}&apikey=${this.apiKey}&hash=${this.hash}`;
  return this.http.get<any>(url).pipe(
    map(response => {
      const heroData = response.data.results[0];
      return {
        id: heroData.id,
        name: heroData.name,
        description: heroData.description ? heroData.description : 'No description available', // Usamos la descripción si existe
        thumbnail: {
          path: heroData.thumbnail.path,
          extension: heroData.thumbnail.extension
        }
      };
    }),
    tap(_ => this.log(`fetched hero id=${id}`)),
    catchError(this.handleError<Hero>(`getHero id=${id}`))
  );
}


  /** GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    const url = `${this.marvelApiUrl}?ts=${this.ts}&apikey=${this.apiKey}&hash=${this.hash}&nameStartsWith=${term}`;
    return this.http.get<any>(url).pipe(
      map(response => response.data.results),
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  //////// Simulated Save methods //////////

  /** Simulate adding a hero */
  addHero(hero: Hero): Observable<Hero> {
    this.log(`Simulated adding hero: ${hero.name}`);
    return of(hero);
  }

  /** Simulate deleting a hero */
  deleteHero(id: number): Observable<Hero> {
    this.log(`Simulated deleting hero with id=${id}`);
    return of({ id } as Hero);
  }

  /** Simulate updating a hero */
  updateHero(hero: Hero): Observable<any> {
    this.log(`Simulated updating hero id=${hero.id}`);
    return of(hero);
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /** Handle Http operation that failed */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
