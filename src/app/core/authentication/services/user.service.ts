import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { map, Observable } from 'rxjs';
import { UpdateProfileForm } from '../../../features/user/update-profile/update-profile-form.model';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  #user = signal<User | null>(null);
  user = this.#user.asReadonly();

  initUser(): Observable<void> {
    return this.getUser().pipe(
      map(userResponse => {
        this.#user.set(userResponse);
        return;
      })
    )
  }

  filterUpdateForm(updateProfileForm: FormGroup<UpdateProfileForm>): Partial<User> {
    const formValue = updateProfileForm.value;
    const filteredForm: Partial<User> = Object.fromEntries(
      Object.entries(formValue).filter(([key, value]) => key !== 'confirmPassword' && value !== null && value !== '')
    );

    return filteredForm;
  }

  getUser(): Observable<User> {
    return this.http.get<User>('http://localhost:3000/user/me');
  }

  updateUser(updatedUser: Partial<User>): Observable<Object> {
    return this.http.patch(`http://localhost:3000/user/me`, updatedUser);
  }

  deleteOwnAccount(): Observable<Object> {
    return this.http.delete('http://localhost:3000/user/me');
  }
}
