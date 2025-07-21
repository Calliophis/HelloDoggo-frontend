import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { Dog } from './dog.model';
import { FormGroup } from '@angular/forms';
import { CreateDogForm } from '../../features/dogs/create-dog/create-dog-form.model';

@Injectable({
  providedIn: 'root'
})
export class DogService {
  private http = inject(HttpClient);

  #dogs = signal<Dog[]>([]);
  dogs = this.#dogs.asReadonly();

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

  getAllDogs(): Observable<void> {
    return this.http.get<Dog[]>('http://localhost:3000/dog/all').pipe(
      map(dogResponse => {
        this.#dogs.set(dogResponse);
        return;
      })
    );
  }

  getDogById(id: number): Observable<Dog> {
    return this.http.get<Dog>(`http://localhost:3000/dog/${id}`);
  }

  createDog(newDog: FormData): Observable<any> {
    return this.http.post('http://localhost:3000/dog/create', newDog);
  }

  updateDogInfo(dog: Partial<Dog>, id: number): Observable<any> {
    return this.http.patch(`http://localhost:3000/dog/${id}`, dog).pipe(
      switchMap(() => this.getAllDogs())
    );
  }

  updateDogImage(formData: FormData, id: number): Observable<any> {
    return this.http.patch(`http://localhost:3000/dog/${id}/image`, formData).pipe(
      switchMap(() => this.getAllDogs())
    );
  }

  deleteDog(id: number) {
    return this.http.delete(`http://localhost:3000/dog/${id}`).pipe(
      switchMap(() => this.getAllDogs())
    );
  }
}
