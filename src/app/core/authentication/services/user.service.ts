import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { map, Observable, switchMap } from 'rxjs';
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

  #pagination = signal<PaginationDto>({
    skip: 0,
    take: 8
  })
  #hasMoreUsers = signal(true);
  hasMoreUsers = this.#hasMoreUsers.asReadonly();

  initUser(): Observable<void> {
    return this.getOwnProfile().pipe(
      map(userResponse => {
        this.#user.set(userResponse);
        return;
      })
    )
  }

  initAllUsers(): Observable<void> {
    return this.getAllUsers();
  }

  refreshUsers(): Observable<void> {
    this.#users.set([]);
    this.#hasMoreUsers.set(true);
    this.#pagination.set({skip: 0, take: this.#pagination().take});
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
    this.#pagination().skip += this.#pagination().take;
    return this.getAllUsers();
  }

  getAllUsers() {
    let url = `${environment.apiUrl}/user/all?take=${this.#pagination().take}`;
    if (this.#pagination().skip > 0) {
      url = `${environment.apiUrl}/user/all?skip=${this.#pagination().skip}&take=${this.#pagination().take}`;
    }

    return this.#http.get<{ users: User[], totalUsers: number }>(url).pipe(
      map(userResponse => {
        this.#users.update(currentUsers => {
          return [...currentUsers, ...userResponse.users]
        })
        if (this.#users().length >= userResponse.totalUsers) {
          this.#hasMoreUsers.set(false);
        }
        return;
      })
    );
  }

  getOwnProfile(): Observable<User> {
    return this.#http.get<User>(`${environment.apiUrl}/user/me`);
  }

  updateOwnProfile(updatedUser: Partial<User>): Observable<object> {
    return this.#http.patch(`${environment.apiUrl}/user/me`, updatedUser)
  }

  updateUserById(id: string, updatedUser: Partial<User>): Observable<void> {
    return this.#http.patch(`${environment.apiUrl}/user/${id}`, updatedUser).pipe(
      switchMap(() => this.refreshUsers())
    );
  }

  deleteOwnAccount(): Observable<object> {
    return this.#http.delete(`${environment.apiUrl}/user/me`);
  }

  deleteUser(id: string): Observable<void> {
    return this.#http.delete(`${environment.apiUrl}/user/${id}`).pipe(
      switchMap(() => this.refreshUsers())
    );
  }
}
