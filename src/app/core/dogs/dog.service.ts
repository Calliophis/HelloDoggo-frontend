import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { Dog } from './dog.model';
import { FormGroup } from '@angular/forms';
import { CreateDogForm } from '../../features/dogs/create-dog/create-dog-form.model';
import { PaginationDto } from '../../shared/models/pagination.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DogService {
  #http = inject(HttpClient);

  #dogs = signal<Dog[]>([]);
  dogs = this.#dogs.asReadonly();

  #pagination = signal<PaginationDto>({
    skip: 0,
    take: 8
  }); 
  #hasMoreDogs = signal(true);
  hasMoreDogs = this.#hasMoreDogs.asReadonly();

  initDogs(): Observable<void> {
    return this.getAllDogs();
  }

  refreshDogs(): Observable<void> {
    this.#dogs.set([]);
    this.#hasMoreDogs.set(true);
    this.#pagination.set({skip: 0, take: this.#pagination().take});
    return this.getAllDogs();
  }

  generateCreateDogFormData(form: FormGroup<CreateDogForm>): FormData {
    const sex =  form.controls.sex.value;
    const image = form.controls.image.value;
    const controls = form.controls;
    const formData = new FormData();
    
    if (!sex || !image) {
      throw new Error('A required field is missing')
    }

    formData.append('name', controls.name.value);
    formData.append('sex', sex);
    formData.append('breed', controls.breed.value);
    formData.append('description', controls.description.value);
    formData.append('image', image);

    return formData;
  }

  generateUpdateDogImageFormData(dogImage: File): FormData {
    const formData = new FormData();
    formData.append('image', dogImage);
    return formData;
  }

  loadMoreDogs(): Observable<void> {
    this.#pagination().skip += this.#pagination().take;
    return this.getAllDogs();
  }

  getAllDogs(): Observable<void> {
    let url = `${environment.apiUrl}/dog/all?take=${this.#pagination().take}`;
    if (this.#pagination().skip > 0) {
      url = `${environment.apiUrl}/dog/all?skip=${this.#pagination().skip}&take=${this.#pagination().take}`;
    }
    
    return this.#http.get<{ dogs: Dog[], totalDogs: number}>(url).pipe(
      map(dogResponse => {
        this.#dogs.update(currentDogs => {
          return [...currentDogs, ...dogResponse.dogs];
        });
        if (this.#dogs().length >= dogResponse.totalDogs) {
          this.#hasMoreDogs.set(false);
        }
        return;
      })
    );
  }

  getDogById(id: string): Observable<Dog> {
    return this.#http.get<Dog>(`${environment.apiUrl}/dog/${id}`);
  }

  createDog(newDog: FormData): Observable<void> {
    return this.#http.post(`${environment.apiUrl}/dog/create`, newDog).pipe(
      switchMap(() => this.refreshDogs())
    );
  }

  updateDogInfo(dog: Partial<Dog>, id: string): Observable<void> {
    return this.#http.patch(`${environment.apiUrl}/dog/${id}`, dog).pipe(
      switchMap(() => this.refreshDogs())
    );
  }

  updateDogImage(formData: FormData, id: string): Observable<void> {
    return this.#http.patch(`${environment.apiUrl}/dog/${id}`, formData).pipe(
      switchMap(() => this.refreshDogs())
    );
  }

  deleteDog(id: string): Observable<void> {
    return this.#http.delete(`${environment.apiUrl}/dog/${id}`).pipe(
      switchMap(() => this.refreshDogs())
    );
  }
}
