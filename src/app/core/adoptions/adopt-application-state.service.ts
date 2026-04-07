import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, of, switchMap, forkJoin } from 'rxjs';
import { AdoptApplicationApiService } from './adopt-application-api.service';
import { AdoptApplication } from './models/adopt-application.model';
import { PaginationDto } from '../../shared/models/pagination.model';
import { UpdateAdoptApplicationStatusDto } from './models/update-adopt-application-status.model';
import { CreateAdoptApplicationDto } from './models/create-adopt-application.model';
import { UserStateService } from '../authentication/services/user-state.service';

@Injectable({
  providedIn: 'root',
})
export class AdoptApplicationStateService {
  #apiService = inject(AdoptApplicationApiService);
  #userState = inject(UserStateService);

  #adoptApplication = signal<AdoptApplication | null>(null);
  readonly adoptApplication = this.#adoptApplication.asReadonly();

  #adoptApplications = signal<AdoptApplication[]>([]);
  readonly adoptApplications = this.#adoptApplications.asReadonly();

  #ownApplications = signal<AdoptApplication[]>([]);
  readonly ownApplications = this.#ownApplications.asReadonly();

  #pagination = signal<PaginationDto>({
    skip: 0,
    take: 100,
  });

  #hasMore = signal(true);
  readonly hasMore = this.#hasMore.asReadonly();

  initAllAdoptApplications(): Observable<void> {
    this.#resetAllState();
    return this.getAllAdoptApplications();
  }

  initOwnAdoptApplications(): Observable<void> {
    if (this.#ownApplications().length > 0) {
      return of(undefined);
    }
    this.#resetOwnState();
    return this.getOwnAdoptApplications();
  }

  getAllAdoptApplications(): Observable<void> {
    return this.#apiService.getAllAdoptApplications(this.#pagination()).pipe(
      map(res => this.#handleResponse(res, 'all'))
    );
  }

  refreshAllAdoptApplications(): Observable<void> {
    this.#resetAllState();
    return this.getAllAdoptApplications();
  }

  refreshOwnAdoptApplications(): Observable<void> {
    this.#resetOwnState();
    return this.getOwnAdoptApplications();
  }

  loadMoreAdoptApplications(): Observable<void> {
    this.#incrementPagination();
    return this.getAllAdoptApplications();
  }

  getAdoptApplicationById(id: string): Observable<void> {
    return this.#apiService.getAdoptApplicationById(id).pipe(
      map(res => this.#adoptApplication.set(res))
    );
  }

  getAdoptApplicationsByDogId(dogId: string): Observable<void> {
    return this.#apiService.getAdoptApplicationsByDogId(this.#pagination(), dogId).pipe(
      map(res => this.#handleResponse(res, 'all'))
    );
  }

  getAdoptApplicationsByUserId(userId: string): Observable<void> {
    return this.#apiService.getAdoptApplicationsByUserId(this.#pagination(), userId).pipe(
      map(res => this.#handleResponse(res, 'all'))
    );
  }

  getOwnAdoptApplications(): Observable<void> {
    return this.#apiService.getOwnAdoptApplications(this.#pagination()).pipe(
      map(res => this.#handleResponse(res, 'own'))
    );
  }

  createAdoptApplication(createDto: CreateAdoptApplicationDto): Observable<void> {
    return this.#apiService.createAdoptApplication(createDto).pipe(
      switchMap(() => this.#refreshAfterMutation())
    );
  }

  updateAdoptApplication(id: string, updateDto: UpdateAdoptApplicationStatusDto): Observable<void> {
    return this.#apiService.updateAdoptApplication(id, updateDto).pipe(
      switchMap(() => this.#refreshAfterMutation())
    );
  }

  deleteAdoptApplication(id: string): Observable<void> {
    return this.#apiService.deleteAdoptApplication(id).pipe(
      switchMap(() => this.#refreshAfterMutation())
    );
  }

  deleteOwnAdoptApplication(dogId: string): Observable<void> {
    const application = this.#findAdoptApplication(dogId);
    if (!application) return of(undefined);

    return this.#apiService.deleteOwnAdoptApplication(application.id).pipe(
      switchMap(() => this.#refreshAfterMutation())
    );
  }

  #refreshAfterMutation(): Observable<void> {
    const role = this.#userState.user()?.role;
    const isAdminView = role === 'admin' || role === 'editor';

    const tasks: Observable<void>[] = [this.refreshOwnAdoptApplications()];
    if (isAdminView) {
      tasks.push(this.refreshAllAdoptApplications());
    }

    return forkJoin(tasks).pipe(map(() => undefined));
  }

  #handleResponse(res: { adoptApplications: AdoptApplication[]; totalAdoptApplications: number }, store: 'all' | 'own'): void {
    this.#appendItems(res.adoptApplications, store);
    if (store === 'all') {
      this.#updateHasMore(res.totalAdoptApplications);
    }
  }

  #appendItems(newItems: AdoptApplication[], store: 'all' | 'own'): void {
    if (store === 'all') {
      this.#adoptApplications.update(current => [...current, ...newItems]);
    } else {
      this.#ownApplications.update(current => [...current, ...newItems]);
    }
  }

  #updateHasMore(total: number): void {
    if (this.#adoptApplications().length >= total) {
      this.#hasMore.set(false);
    }
  }

  #resetAllState(): void {
    this.#adoptApplications.set([]);
    this.#hasMore.set(true);
    this.#pagination.set({
      skip: 0,
      take: this.#pagination().take,
    });
  }

  #resetOwnState(): void {
    this.#ownApplications.set([]);
  }

  #incrementPagination(): void {
    this.#pagination.update(pagination => ({
      ...pagination,
      skip: pagination.skip + pagination.take,
    }));
  }

  #findAdoptApplication(dogId: string): AdoptApplication | null {
    return this.#ownApplications().find(application => application.dog.id === dogId) || null;
  }
}
