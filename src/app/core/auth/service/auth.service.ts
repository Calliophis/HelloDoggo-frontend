import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { LoginDto } from '../dto/login.dto';
import { SignupDto } from '../dto/signup.dto';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);
  isAuthenticated = computed<boolean>(() => !!this.token());
  token = signal<string | null>(null);

  init(): void {
    this.updateToken();
  }

  signup(user: SignupDto): Observable<Object> {
    return this.http.post('http://localhost:3000/auth/signup', user).pipe(
      switchMap(() => {
        const loginUser: LoginDto = {
          email: user.email,
          password: user.password
        }
        
        return this.login(loginUser);
      })
    )
  }

  login(user: LoginDto): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>('http://localhost:3000/auth/login', user).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access_token);
        this.updateToken();
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.updateToken();
    this.router.navigateByUrl('/auth/login');
  }

  private updateToken(): void {
    this.token.set(localStorage.getItem('access_token'));
  }
  
}
