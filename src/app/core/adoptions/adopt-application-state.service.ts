import { inject, Injectable, signal } from '@angular/core';
import { AdoptApplicationApiService } from './adopt-application-api.service';
import { AdoptApplication } from './models/adopt-application.model';
import { PaginationDto } from '../../shared/models/pagination.model';
import { map, Observable, of, switchMap } from 'rxjs';
import { UpdateAdoptApplicationStatusDto } from './models/update-adopt-application-status.model';
import { CreateAdoptApplicationDto } from './models/create-adopt-application.model';

@Injectable({
  providedIn: 'root',
})
export class AdoptApplicationStateService {
  #apiService = inject(AdoptApplicationApiService);

  #adoptApplication = signal<AdoptApplication | null>(null);
  readonly adoptApplication = this.#adoptApplication.asReadonly();

  #adoptApplications = signal<AdoptApplication[]>([]);
  readonly adoptApplications = this.#adoptApplications.asReadonly();

  #pagination = signal<PaginationDto>({
    skip: 0,
    take: 100,
  });

  #hasMore = signal(true);
  readonly hasMore = this.#hasMore.asReadonly();

  initAllAdoptApplications(): Observable<void> {
    this.resetState();
    return this.getAllAdoptApplications();
  }

  initOwnAdoptApplications(): Observable<void> {
    this.resetState();
    return this.getOwnAdoptApplications();
  }

  getAllAdoptApplications(): Observable<void> {
    return this.#apiService.getAllAdoptApplications(this.#pagination()).pipe(
      map(res => this.applyPage(res))
    );
  }

  refreshAllAdoptApplications(): Observable<void> {
    this.resetState();
    return this.getAllAdoptApplications();
  }

  refreshOwnAdoptApplications(): Observable<void> {
    this.resetState();
    return this.getOwnAdoptApplications();
  }

  loadMoreAdoptApplications(): Observable<void> {
    this.incrementPagination();
    return this.getAllAdoptApplications();
  }

  getAdoptApplicationById(id: string): Observable<void> {
    return this.#apiService.getAdoptApplicationById(id).pipe(
      map(res => this.#adoptApplication.set(res))
    );
  }

  getAdoptApplicationsByDogId(dogId: string): Observable<void> {
    return this.#apiService.getAdoptApplicationsByDogId(this.#pagination(), dogId).pipe(
      map(res => this.applyPage(res))
    );
  }

  getAdoptApplicationsByUserId(userId: string): Observable<void> {
    return this.#apiService.getAdoptApplicationsByUserId(this.#pagination(), userId).pipe(
      map(res => this.applyPage(res))
    );
  }

  getOwnAdoptApplications(): Observable<void> {
    return this.#apiService.getOwnAdoptApplications(this.#pagination()).pipe(
      map(res => this.applyPage(res))
    );
  }

  createAdoptApplication(createDto: CreateAdoptApplicationDto): Observable<void> {
    return this.#apiService.createAdoptApplication(createDto).pipe(
      switchMap(() => this.refreshOwnAdoptApplications())
    );
  }

  updateAdoptApplication(id: string, updateDto: UpdateAdoptApplicationStatusDto): Observable<void> {
    return this.#apiService.updateAdoptApplication(id, updateDto).pipe(
      switchMap(() => this.refreshAllAdoptApplications())
    );
  }

  deleteAdoptApplication(id: string): Observable<void> {
    return this.#apiService.deleteAdoptApplication(id).pipe(
      switchMap(() => this.refreshAllAdoptApplications())
    );
  }

  deleteOwnAdoptApplication(dogId: string): Observable<void> {
    const application = this.findAdoptApplication(dogId);
    if (!application) {
      return of(undefined);
    }
    return this.#apiService.deleteOwnAdoptApplication(application.id).pipe(
      switchMap(() => this.refreshOwnAdoptApplications())
    );
  }

  private applyPage(res: { adoptApplications: AdoptApplication[]; totalAdoptApplications: number }): void {
    this.appendItems(res.adoptApplications);
    this.updateHasMore(res.totalAdoptApplications);
  }

  private appendItems(newItems: AdoptApplication[]): void {
    this.#adoptApplications.update(current => [...current, ...newItems]);
  }

  private updateHasMore(total: number): void {
    if (this.#adoptApplications().length >= total) {
      this.#hasMore.set(false);
    }
  }

  private resetState(): void {
    this.#adoptApplications.set([]);
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

  private findAdoptApplication(dogId: string): AdoptApplication | null {
    return this.#adoptApplications().find(application => application.dogId === dogId) || null;
  }
}
