import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { map, Observable } from 'rxjs';
import { UpdateProfileForm } from '../../../features/user/update-profile/update-profile-form.model';
import { FormGroup } from '@angular/forms';
import { PaginationDto } from '../../../shared/models/pagination.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  #http = inject(HttpClient);

  #user = signal<User | null>(null);
  user = this.#user.asReadonly();

  #users = signal<User[]>([]);
  users = this.#users.asReadonly();

  #pagination= signal<PaginationDto>({
    page: 1,
    elementsPerPage: 12
  })
  #hasMoreUsers = signal(true);
  hasMoreUsers = this.#hasMoreUsers.asReadonly();

  initUser(): Observable<void> {
    return this.getUser().pipe(
      map(userResponse => {
        this.#user.set(userResponse);
        return;
      })
    )
  }

  initAllUsers(): Observable<void> {
    return this.getAllUsers();
  }

  filterUpdateForm(updateProfileForm: FormGroup<UpdateProfileForm>): Partial<User> {
    const formValue = updateProfileForm.value;
    const filteredForm: Partial<User> = Object.fromEntries(
      Object.entries(formValue).filter(([key, value]) => key !== 'confirmPassword' && value !== null && value !== '')
    );

    return filteredForm;
  }

  loadMoreUsers() {
    this.#pagination().page++;
    return this.getAllUsers();
  }

  getAllUsers() {
    let url = `${environment.apiUrl}/user/all`;
    if (this.#pagination().page > 0) {
      url = `${environment.apiUrl}/user/all?page=${this.#pagination().page}&elementsPerPage=${this.#pagination().elementsPerPage}`;
    }

    return this.#http.get<{ paginatedItems: User[], totalNumberOfItems: number }>(url).pipe(
      map(userResponse => {
        this.#users.update(currentUsers => {
          return [...currentUsers, ...userResponse.paginatedItems]
        })
        if (this.#users().length >= userResponse.totalNumberOfItems) {
          this.#hasMoreUsers.set(false);
        }
        return;
      })
    );
  }

  getUser(): Observable<User> {
    return this.#http.get<User>(`${environment.apiUrl}/user/me`);
  }

  updateUser(updatedUser: Partial<User>): Observable<object> {
    return this.#http.patch(`${environment.apiUrl}/user/me`, updatedUser);
  }

  updateUserById(id: number, updatedUser: Partial<User>): Observable<object> {
    return this.#http.patch(`${environment.apiUrl}/user/${id}`, updatedUser);
  }

  deleteOwnAccount(): Observable<object> {
    return this.#http.delete(`${environment.apiUrl}/user/me`);
  }
}
