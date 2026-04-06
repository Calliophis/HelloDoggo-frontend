import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdoptApplication } from './models/adopt-application.model';
import { environment } from '../../../environments/environment';
import { PaginationDto } from '../../shared/models/pagination.model';
import { UpdateAdoptApplicationStatusDto } from './models/update-adopt-application-status.model';
import { CreateAdoptApplicationDto } from './models/create-adopt-application.model';

@Injectable({
  providedIn: 'root',
})
export class AdoptApplicationApiService {
  #http = inject(HttpClient);

  getAllAdoptApplications(pagination: PaginationDto): Observable<{ adoptApplications: AdoptApplication[], totalAdoptApplications: number }> {
    let url = `${environment.apiUrl}/adopt-application/all?take=${pagination.take}`;
    if (pagination.skip > 0) {
      url = `${environment.apiUrl}/adopt-application/all?skip=${pagination.skip}&take=${pagination.take}`;
    }
    return this.#http.get<{ adoptApplications: AdoptApplication[], totalAdoptApplications: number }>(url);
  }

  getAdoptApplicationById(id: string): Observable<AdoptApplication> {
    return this.#http.get<AdoptApplication>(`${environment.apiUrl}/adopt-application/${id}`);
  }

  getAdoptApplicationsByDogId(pagination: PaginationDto, dogId: string): Observable<{ adoptApplications: AdoptApplication[], totalAdoptApplications: number }> {
    let url = `${environment.apiUrl}/adopt-application/dog/${dogId}?take=${pagination.take}`;
    if (pagination.skip > 0) {
      url = `${environment.apiUrl}/adopt-application/dog/${dogId}?skip=${pagination.skip}&take=${pagination.take}`;
    }
    return this.#http.get<{ adoptApplications: AdoptApplication[], totalAdoptApplications: number }>(url);
  }

  getAdoptApplicationsByUserId(pagination: PaginationDto, userId: string): Observable<{ adoptApplications: AdoptApplication[], totalAdoptApplications: number }> {
    let url = `${environment.apiUrl}/adopt-application/user/${userId}?take=${pagination.take}`;
    if (pagination.skip > 0) {
      url = `${environment.apiUrl}/adopt-application/user/${userId}?skip=${pagination.skip}&take=${pagination.take}`;
    }
    return this.#http.get<{ adoptApplications: AdoptApplication[], totalAdoptApplications: number }>(url);
  }

  getOwnAdoptApplications(pagination: PaginationDto): Observable<{ adoptApplications: AdoptApplication[], totalAdoptApplications: number }> {
    let url = `${environment.apiUrl}/adopt-application/me?take=${pagination.take}`;
    if (pagination.skip > 0) {
      url = `${environment.apiUrl}/adopt-application/me?skip=${pagination.skip}&take=${pagination.take}`;
    }
    return this.#http.get<{ adoptApplications: AdoptApplication[], totalAdoptApplications: number }>(url);
  }

  createAdoptApplication(createDto: CreateAdoptApplicationDto): Observable<AdoptApplication> {
    return this.#http.post<AdoptApplication>(`${environment.apiUrl}/adopt-application`, createDto);
  }

  updateAdoptApplication(id: string, updateDto: UpdateAdoptApplicationStatusDto): Observable<AdoptApplication> {
    return this.#http.patch<AdoptApplication>(`${environment.apiUrl}/adopt-application/${id}`, updateDto);
  }

  deleteAdoptApplication(id: string): Observable<boolean> {
    return this.#http.delete<boolean>(`${environment.apiUrl}/adopt-application/${id}`);
  }

  deleteOwnAdoptApplication(id: string): Observable<boolean> {
    return this.#http.delete<boolean>(`${environment.apiUrl}/adopt-application/me/${id}`);
  }

}
