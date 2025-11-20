import { inject, Injectable, signal } from "@angular/core";
import { Dog } from "./dog.model";
import { map, Observable, switchMap } from "rxjs";
import { DogApiService } from "./dog-api.service";
import { PaginationDto } from "../../shared/models/pagination.model";
import { FormGroup } from "@angular/forms";
import { CreateDogForm } from "../../features/dogs/create-dog/create-dog-form.model";
import { UpdateDogForm } from "../../features/dogs/update-dog/update-dog-form.model";

@Injectable({
    providedIn: 'root'
  })
  export class DogStateService {
    #dogApiService = inject(DogApiService);

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

    getAllDogs(): Observable<void> {     
        return this.#dogApiService.getAllDogs(this.#pagination()).pipe(
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

    refreshDogs(): Observable<void> {
        this.#dogs.set([]);
        this.#hasMoreDogs.set(true);
        this.#pagination.set({skip: 0, take: this.#pagination().take});
        return this.getAllDogs();
    }

    loadMoreDogs(): Observable<void> {
        this.#pagination().skip += this.#pagination().take;
        return this.getAllDogs();
    }

    getDogById(id: string): Observable<Dog> {
        return this.#dogApiService.getDogById(id);
    }
    
    createDog(form: FormGroup<CreateDogForm>): Observable<void> {
        const formData = this.#dogApiService.generateCreateDogFormData(form);
        return this.#dogApiService.createDog(formData).pipe(
            switchMap(() => this.refreshDogs())
        );
    }
    
    updateDog(form: FormGroup<UpdateDogForm>, id: string): Observable<void> {
        const formData = this.#dogApiService.generateUpdateDogFormData(form);
        return this.#dogApiService.updateDog(formData, id).pipe(
            switchMap(() => this.refreshDogs())
        );
    }
    
    deleteDog(id: string): Observable<void> {
        return this.#dogApiService.deleteDog(id).pipe(
            switchMap(() => this.refreshDogs())
        );
    }
  }