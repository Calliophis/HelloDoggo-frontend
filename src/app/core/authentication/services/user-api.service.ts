import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { PaginationDto } from "../../../shared/models/pagination.model";
import { User } from "../models/user.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserApiService {
    #http = inject(HttpClient);

    getAllUsers(pagination: PaginationDto): Observable<{ users: User[], totalUsers: number }> {
        let url = `${environment.apiUrl}/user/all?take=${pagination.take}`;
        if (pagination.skip > 0) {
          url = `${environment.apiUrl}/user/all?skip=${pagination.skip}&take=${pagination.take}`;
        }
        return this.#http.get<{ users: User[], totalUsers: number }>(url);
    }

    getOwnProfile(): Observable<User> {
        return this.#http.get<User>(`${environment.apiUrl}/user/me`);
    }

    updateOwnProfile(updatedUser: Partial<User>): Observable<object> {
        return this.#http.patch(`${environment.apiUrl}/user/me`, updatedUser)
    }

    updateUserById(id: string, updatedUser: Partial<User>): Observable<object> {
        return this.#http.patch(`${environment.apiUrl}/user/${id}`, updatedUser);
    }

    deleteOwnAccount(): Observable<object> {
        return this.#http.delete(`${environment.apiUrl}/user/me`);
    }

    deleteUser(id: string): Observable<object> {
        return this.#http.delete(`${environment.apiUrl}/user/${id}`);
    }
}