import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginDto } from '../models/login.model';
import { Role } from '../models/role.type';
import { SignupDto } from '../models/signup.model';
import { environment } from '../../../../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  #http = inject(HttpClient);
  #router = inject(Router);
  #userService = inject(UserService);

  isAuthenticated = computed<boolean>(() => !!this.#token());
  #token = signal<string | null>(null);
  token = this.#token.asReadonly();
  role = computed(() => this.#userService.user()?.role);

  initAuthentication(): Observable<void> {
    this.#updateToken();
    return this.#userService.initUser();
  }

  signup(user: SignupDto): Observable<void> {
    return this.#http.post(`${environment.apiUrl}/auth/signup`, user).pipe(
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
    return this.#http.post<{ accessToken: string, role: Role }>(`${environment.apiUrl}/auth/login`, user).pipe(
      switchMap(loginResponse => {
        localStorage.setItem('accessToken', loginResponse.accessToken);
        this.#updateToken();
        return this.#userService.initUser();
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
