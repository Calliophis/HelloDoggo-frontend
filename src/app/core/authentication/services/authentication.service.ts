import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginDto } from '../models/login.model';
import { Role } from '../models/role.type';
import { SignupDto } from '../models/signup.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private http = inject(HttpClient);
  private router = inject(Router);

  isAuthenticated = computed<boolean>(() => !!this.#token());
  #token = signal<string | null>(null);
  token = this.#token.asReadonly();
  #role = signal<Role | null>(null);
  role = this.#role.asReadonly();

  initAuthentication(): void {
    this.updateToken();
    this.updateRole();
  }

  signup(user: SignupDto): Observable<Object> {
    return this.http.post('http://localhost:3000/auth/signup', user).pipe(
      switchMap(() => {
        const loginUser: LoginDto = {
          email: user.email,
          password: user.password
        };
        return this.login(loginUser);
      })
    )
  }

  login(user: LoginDto): Observable<{ access_token: string, role: Role }> {
    return this.http.post<{ access_token: string, role: Role }>('http://localhost:3000/auth/login', user).pipe(
      tap(loginResponse => {
        localStorage.setItem('access_token', loginResponse.access_token);
        localStorage.setItem('role', loginResponse.role);
        this.updateToken();
        this.updateRole();
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    this.updateToken();
    this.updateRole();
    this.router.navigateByUrl('/auth/login');
  }

  private updateToken(): void {
    this.#token.set(localStorage.getItem('access_token'));
  }

  private updateRole(): void {
    const storedRole = localStorage.getItem('role');
    this.#role.set(storedRole as Role);
  }
}
