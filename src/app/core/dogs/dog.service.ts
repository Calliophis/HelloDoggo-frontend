import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, switchMap, tap } from 'rxjs';
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
  #pagination: PaginationDto = {
    page: 1,
    elementsPerPage: 12
  }
  #hasMoreDogs = signal(true);
  hasMoreDogs = this.#hasMoreDogs.asReadonly();
  #isLoading = signal(false);
  isLoading = this.#isLoading.asReadonly();


  initDogs(): Observable<void> {
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
    this.#pagination.page++;
    return this.getAllDogs();
  }

  getAllDogs(): Observable<void> {
    this.#isLoading.set(true);
    let url = `${environment.apiUrl}/dog/all`;
    if (this.#pagination.page > 0) {
      url = `${environment.apiUrl}/dog/all?page=${this.#pagination.page}&elementsPerPage=${this.#pagination.elementsPerPage}`;
    }
    
    return this.#http.get<{paginatedItems: Dog[], totalNumberOfItems: number}>(url).pipe(
      map(dogResponse => {
        this.#dogs.update(currentDogs => {
          return [...currentDogs, ...dogResponse.paginatedItems];
        });
        if (this.#dogs().length >= dogResponse.totalNumberOfItems) {
          this.#hasMoreDogs.set(false);
        }
        return;
      }),
      tap(() => this.#isLoading.set(false))
    );
  }

  getDogById(id: number): Observable<Dog> {
    return this.#http.get<Dog>(`${environment.apiUrl}/dog/${id}`);
  }

  createDog(newDog: FormData): Observable<object> {
    return this.#http.post(`${environment.apiUrl}/dog/create`, newDog);
  }

  updateDogInfo(dog: Partial<Dog>, id: number): Observable<void> {
    return this.#http.patch(`${environment.apiUrl}/dog/${id}`, dog).pipe(
      switchMap(() => this.getAllDogs())
    );
  }

  updateDogImage(formData: FormData, id: number): Observable<void> {
    return this.#http.patch(`${environment.apiUrl}/dog/${id}/image`, formData).pipe(
      switchMap(() => this.getAllDogs())
    );
  }

  deleteDog(id: number): Observable<void> {
    return this.#http.delete(`${environment.apiUrl}/dog/${id}`).pipe(
      switchMap(() => this.getAllDogs())
    );
  }
}
