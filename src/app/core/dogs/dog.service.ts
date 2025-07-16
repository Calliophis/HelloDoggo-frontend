import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dog } from './dog.model';

@Injectable({
  providedIn: 'root'
})
export class DogService {
  private http = inject(HttpClient);

  getAllDogs(): Observable<Dog[]> {
    return this.http.get<Dog[]>('http://localhost:3000/dog/all');
  }

  createDog(newDog: FormData): Observable<any> {
    return this.http.post('http://localhost:3000/dog/create', newDog);
  }

  updateDogInfo(dog: Partial<Dog>, id: number): Observable<any> {
    return this.http.patch(`http://localhost:3000/dog/${id}`, dog);
  }

  updateDogImage(dogImage: File, id: number): Observable<any> {
    const formData = new FormData();
    formData.append('image', dogImage);
    return this.http.patch(`http://localhost:3000/dog/${id}/image`, formData);
  }
}
