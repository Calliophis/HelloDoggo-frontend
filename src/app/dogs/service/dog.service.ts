import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Dog } from '../../shared/models/dog.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DogService {

  constructor() { }

  private http = inject(HttpClient);

  getAllDogs(): Observable<Dog[]> {
    return this.http.get<Dog[]>('http://localhost:3000/dog/all');
  }
}
