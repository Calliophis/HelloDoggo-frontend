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
    #apiService = inject(DogApiService);

    #dogs = signal<Dog[]>([]);
    readonly dogs = this.#dogs.asReadonly();

    #pagination = signal<PaginationDto>({
        skip: 0,
        take: 8
    });

    #hasMore = signal(true);
    readonly hasMore = this.#hasMore.asReadonly();

    initDogs(): Observable<void> {
        return this.getAllDogs();
    }

    getAllDogs(): Observable<void> {
        return this.#apiService.getAllDogs(this.#pagination()).pipe(
            map(res => this.applyPage(res))
        );
    }

    refreshDogs(): Observable<void> {
        this.resetState();
        return this.getAllDogs();
    }

    loadMoreDogs(): Observable<void> {
        this.incrementPagination();
        return this.getAllDogs();
    }

    getDogById(id: string): Observable<Dog> {
        return this.#apiService.getDogById(id);
    }

    createDog(form: FormGroup<CreateDogForm>): Observable<void> {
        const formData = this.#apiService.generateCreateDogFormData(form);
        return this.#apiService.createDog(formData).pipe(
            switchMap(() => this.refreshDogs())
        );
    }

    updateDog(form: FormGroup<UpdateDogForm>, id: string): Observable<void> {
        const formData = this.#apiService.generateUpdateDogFormData(form);
        return this.#apiService.updateDog(formData, id).pipe(
            switchMap(() => this.refreshDogs())
        );
    }

    deleteDog(id: string): Observable<void> {
        return this.#apiService.deleteDog(id).pipe(
            switchMap(() => this.refreshDogs())
        );
    }

    private applyPage(res: { dogs: Dog[]; totalDogs: number }): void {
        this.appendItems(res.dogs);
        this.updateHasMore(res.totalDogs);
    }

    private appendItems(newItems: Dog[]): void {
        this.#dogs.update(current => [...current, ...newItems]);
    }

    private updateHasMore(total: number): void {
        if (this.#dogs().length >= total) {
            this.#hasMore.set(false);
        }
    }

    private resetState(): void {
        this.#dogs.set([]);
        this.#hasMore.set(true);
        this.#pagination.set({
            skip: 0,
            take: this.#pagination().take,
        });
    }

    private incrementPagination(): void {
        this.#pagination.update(pagination => ({
            ...pagination,
            skip: pagination.skip + pagination.take,
        }));
    }
}
