import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginationDto } from '../../shared/models/pagination.model';
import { AdoptApplication } from './models/adopt-application.model';
import { CreateAdoptApplicationDto } from './models/create-adopt-application.model';
import { UpdateAdoptApplicationStatusDto } from './models/update-adopt-application-status.model';

@Injectable({
  providedIn: 'root',
})
export class AdoptApplicationApiService {
  #http = inject(HttpClient);

  getAllAdoptApplications(pagination: PaginationDto): Observable<{ adoptApplications: AdoptApplication[], totalAdoptApplications: number }> {
    let url = `${environment.apiUrl}/adoption-application/all?take=${pagination.take}`;
    if (pagination.skip > 0) {
      url = `${environment.apiUrl}/adoption-application/all?skip=${pagination.skip}&take=${pagination.take}`;
    }
    return this.#http.get<{ adoptApplications: AdoptApplication[], totalAdoptApplications: number }>(url);
  }

  getAdoptApplicationById(id: string): Observable<AdoptApplication | null> {
    return this.#http.get<AdoptApplication | null>(`${environment.apiUrl}/adoption-application/${id}`);
  }

  getAdoptApplicationsByDogId(pagination: PaginationDto, dogId: string): Observable<{ adoptApplications: AdoptApplication[], totalAdoptApplications: number }> {
    let url = `${environment.apiUrl}/adoption-application/dog/${dogId}?take=${pagination.take}`;
    if (pagination.skip > 0) {
      url = `${environment.apiUrl}/adoption-application/dog/${dogId}?skip=${pagination.skip}&take=${pagination.take}`;
    }
    return this.#http.get<{ adoptApplications: AdoptApplication[], totalAdoptApplications: number }>(url);
  }

  getAdoptApplicationsByUserId(pagination: PaginationDto, userId: string): Observable<{ adoptApplications: AdoptApplication[], totalAdoptApplications: number }> {
    let url = `${environment.apiUrl}/adoption-application/user/${userId}?take=${pagination.take}`;
    if (pagination.skip > 0) {
      url = `${environment.apiUrl}/adoption-application/user/${userId}?skip=${pagination.skip}&take=${pagination.take}`;
    }
    return this.#http.get<{ adoptApplications: AdoptApplication[], totalAdoptApplications: number }>(url);
  }

  getOwnAdoptApplications(pagination: PaginationDto): Observable<{ adoptApplications: AdoptApplication[], totalAdoptApplications: number }> {
    let url = `${environment.apiUrl}/adoption-application/me?take=${pagination.take}`;
    if (pagination.skip > 0) {
      url = `${environment.apiUrl}/adoption-application/me?skip=${pagination.skip}&take=${pagination.take}`;
    }
    return this.#http.get<{ adoptApplications: AdoptApplication[], totalAdoptApplications: number }>(url);
  }

  createAdoptApplication(createDto: CreateAdoptApplicationDto): Observable<AdoptApplication> {
    return this.#http.post<AdoptApplication>(`${environment.apiUrl}/adoption-application`, createDto);
  }

  updateAdoptApplication(id: string, updateDto: UpdateAdoptApplicationStatusDto): Observable<AdoptApplication> {
    return this.#http.patch<AdoptApplication>(`${environment.apiUrl}/adoption-application/${id}`, updateDto);
  }

  deleteAdoptApplication(id: string): Observable<boolean> {
    return this.#http.delete<boolean>(`${environment.apiUrl}/adoption-application/${id}`);
  }

  deleteOwnAdoptApplication(id: string): Observable<boolean> {
    return this.#http.delete<boolean>(`${environment.apiUrl}/adoption-application/me/${id}`);
  }

}
