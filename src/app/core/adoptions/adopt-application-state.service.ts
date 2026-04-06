import { inject, Injectable, signal } from '@angular/core';
import { AdoptApplicationApiService } from './adopt-application-api.service';
import { AdoptApplication } from './models/adopt-application.model';
import { PaginationDto } from '../../shared/models/pagination.model';
import { map, Observable, switchMap } from 'rxjs';
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
    take: 8,
  });

  #hasMore = signal(true);
  readonly hasMore = this.#hasMore.asReadonly();

  initAdoptApplications(): Observable<void> {
    return this.getAllAdoptApplications();
  }

  getAllAdoptApplications(): Observable<void> {
    return this.#apiService.getAllAdoptApplications(this.#pagination()).pipe(
      map(res => this.applyPage(res))
    );
  }

  refreshAdoptApplications(): Observable<void> {
    this.resetState();
    return this.getAllAdoptApplications();
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

  getAdoptApplicationsByDogId(pagination: PaginationDto, dogId: string): Observable<void> {
    return this.#apiService.getAdoptApplicationsByDogId(pagination, dogId).pipe(
      map(res => this.applyPage(res))
    );
  }

  getAdoptApplicationsByUserId(pagination: PaginationDto, userId: string): Observable<void> {
    return this.#apiService.getAdoptApplicationsByUserId(pagination, userId).pipe(
      map(res => this.applyPage(res))
    );
  }

  getOwnAdoptApplications(pagination: PaginationDto): Observable<void> {
    return this.#apiService.getOwnAdoptApplications(pagination).pipe(
      map(res => this.applyPage(res))
    );
  }

  createAdoptApplication(createDto: CreateAdoptApplicationDto): Observable<void> {
    return this.#apiService.createAdoptApplication(createDto).pipe(
      switchMap(() => this.refreshAdoptApplications())
    );
  }

  updateAdoptApplication(id: string, updateDto: UpdateAdoptApplicationStatusDto): Observable<void> {
    return this.#apiService.updateAdoptApplication(id, updateDto).pipe(
      switchMap(() => this.refreshAdoptApplications())
    );
  }

  deleteAdoptApplication(id: string): Observable<void> {
    return this.#apiService.deleteAdoptApplication(id).pipe(
      switchMap(() => this.refreshAdoptApplications())
    );
  }

  deleteOwnAdoptApplication(id: string): Observable<void> {
    return this.#apiService.deleteOwnAdoptApplication(id).pipe(
      switchMap(() => this.refreshAdoptApplications())
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
}
