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
  #apiService = inject(UserApiService);

  #user = signal<User | null>(null);
  readonly user = this.#user.asReadonly();

  #users = signal<User[]>([]);
  readonly users = this.#users.asReadonly();

  #pagination = signal<PaginationDto>({
    skip: 0,
    take: 8
  })
  #hasMore = signal(true);
  readonly hasMore = this.#hasMore.asReadonly();

  initUser(): Observable<void> {
    return this.getOwnProfile().pipe(
      map(res => {
        this.#user.set(res);
        return;
      })
    )
  }

  clearUser(): void {
    this.#user.set(null);
  }

  initAllUsers(): Observable<void> {
    return this.getAllUsers();
  }

  refreshUsers(): Observable<void> {
    this.resetState();
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
    this.incrementPagination();
    return this.getAllUsers();
  }

  getAllUsers() {
    return this.#apiService.getAllUsers(this.#pagination()).pipe(
      map(res => this.applyPage(res))
    );
  }

  getOwnProfile(): Observable<User> {
    return this.#apiService.getOwnProfile();
  }

  updateOwnProfile(form: FormGroup<UpdateProfileForm>): Observable<object> {
    const updatedUser = this.filterUpdateForm(form);
    return this.#apiService.updateOwnProfile(updatedUser);
  }

  updateUserById(id: string, updatedUser: Partial<User>): Observable<void> {
    return this.#apiService.updateUserById(id, updatedUser).pipe(
      switchMap(() => this.refreshUsers())
    );
  }

  deleteOwnAccount(): Observable<object> {
    return this.#apiService.deleteOwnAccount();
  }

  deleteUser(id: string): Observable<void> {
    return this.#apiService.deleteUser(id).pipe(
      switchMap(() => this.refreshUsers())
    );
  }

  private applyPage(res: { users: User[]; totalUsers: number }): void {
    this.appendItems(res.users);
    this.updateHasMore(res.totalUsers);
  }

  private appendItems(newItems: User[]): void {
    this.#users.update(current => [...current, ...newItems]);
  }

  private updateHasMore(total: number): void {
    if (this.#users().length >= total) {
      this.#hasMore.set(false);
    }
  }

  private resetState(): void {
    this.#users.set([]);
    this.#hasMore.set(true);
    this.#pagination.set({ skip: 0, take: this.#pagination().take });
  }

  private incrementPagination(): void {
    this.#pagination.update(pagination => ({
      ...pagination,
      skip: pagination.skip + pagination.take,
    }));
  }
}
