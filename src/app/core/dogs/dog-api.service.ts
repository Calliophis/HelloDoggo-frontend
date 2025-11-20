import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dog } from './dog.model';
import { FormGroup } from '@angular/forms';
import { CreateDogForm } from '../../features/dogs/create-dog/create-dog-form.model';
import { PaginationDto } from '../../shared/models/pagination.model';
import { environment } from '../../../environments/environment';
import { UpdateDogForm } from '../../features/dogs/update-dog/update-dog-form.model';

@Injectable({
  providedIn: 'root'
})
export class DogApiService {
  #http = inject(HttpClient);

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

  generateUpdateDogFormData(form: FormGroup<UpdateDogForm>): FormData {
    const sex =  form.controls.sex.value;
    const image = form.controls.image.value;
    const controls = form.controls;
    const formData = new FormData();

    formData.append('name', controls.name.value);
    formData.append('sex', sex);
    formData.append('breed', controls.breed.value);
    formData.append('description', controls.description.value);
    if (image) {
      formData.append('image', image);
    }

    return formData;
  }

  getAllDogs(pagination: PaginationDto): Observable<{dogs: Dog[], totalDogs: number}> {
    let url = `${environment.apiUrl}/dog/all?take=${pagination.take}`;
    if (pagination.skip > 0) {
      url = `${environment.apiUrl}/dog/all?skip=${pagination.skip}&take=${pagination.take}`;
    }
    return this.#http.get<{ dogs: Dog[], totalDogs: number}>(url);
  }

  getDogById(id: string): Observable<Dog> {
    return this.#http.get<Dog>(`${environment.apiUrl}/dog/${id}`);
  }

  createDog(newDog: FormData): Observable<object> {
    return this.#http.post(`${environment.apiUrl}/dog/create`, newDog);
  }

  updateDog(formData: FormData, id: string): Observable<object> {
    return this.#http.patch(`${environment.apiUrl}/dog/${id}`, formData);
  }

  deleteDog(id: string): Observable<object> {
    return this.#http.delete(`${environment.apiUrl}/dog/${id}`);
  }
}
