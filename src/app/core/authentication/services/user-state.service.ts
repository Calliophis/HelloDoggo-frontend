import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { map, Observable, switchMap } from 'rxjs';
import { UpdateProfileForm } from '../../../features/user/update-profile/update-profile-form.model';
import { FormGroup } from '@angular/forms';
import { PaginationDto } from '../../../shared/models/pagination.model';
import { UserApiService } from './user-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  #userApiService = inject(UserApiService);

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
    return this.#userApiService.getAllUsers(this.#pagination()).pipe(
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
    return this.#userApiService.getOwnProfile();
  }

  updateOwnProfile(form: FormGroup<UpdateProfileForm>): Observable<object> {
    const updatedUser = this.filterUpdateForm(form);
    return this.#userApiService.updateOwnProfile(updatedUser);
  }

  updateUserById(id: string, updatedUser: Partial<User>): Observable<void> {
    return this.#userApiService.updateUserById(id, updatedUser).pipe(
      switchMap(() => this.refreshUsers())
    );
  }

  deleteOwnAccount(): Observable<object> {
    return this.#userApiService.deleteOwnAccount();
  }

  deleteUser(id: string): Observable<void> {
    return this.#userApiService.deleteUser(id).pipe(
      switchMap(() => this.refreshUsers())
    );
  }
}
