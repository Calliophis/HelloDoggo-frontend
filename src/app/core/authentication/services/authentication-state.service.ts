import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginDto } from '../models/login.model';
import { SignupDto } from '../models/signup.model';
import { UserStateService } from './user-state.service';
import { AuthenticationApiService } from './authentication-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationStateService {
  
  #router = inject(Router);
  #userStateService = inject(UserStateService);
  #authenticationApiService = inject(AuthenticationApiService);

  isAuthenticated = computed<boolean>(() => !!this.#token());
  #token = signal<string | null>(null);
  token = this.#token.asReadonly();
  role = computed(() => this.#userStateService.user()?.role);

  initAuthentication(): Observable<void> {
    this.#updateToken();
    return this.#userStateService.initUser();
  }

  signup(user: SignupDto): Observable<void> {
    return this.#authenticationApiService.signup(user).pipe(
      switchMap(() => {
        const loginUser: LoginDto = {
          email: user.email,
          password: user.password
        };
        return this.login(loginUser);
      })
    )
  }

  login(user: LoginDto): Observable<void> {
    return this.#authenticationApiService.login(user).pipe(
      switchMap(loginResponse => {
        localStorage.setItem('accessToken', loginResponse.accessToken);
        this.#updateToken();
        return this.#userStateService.initUser();
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.#updateToken();
    this.#router.navigateByUrl('/auth/login');
  }

  #updateToken(): void {
    this.#token.set(localStorage.getItem('accessToken'));
  }
}
