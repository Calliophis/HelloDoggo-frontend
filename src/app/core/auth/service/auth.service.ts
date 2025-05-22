import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginDto } from '../dto/login.dto';
import { SignupDto } from '../dto/signup.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  isAuthenticated = signal<boolean>(!!localStorage.getItem('access_token'));

  signup(user: SignupDto) {
    return this.http.post('http://localhost:3000/auth/signup', user).pipe(
      tap(res => console.log(res))
    )
  }

  login(user: LoginDto): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>('http://localhost:3000/auth/login', user).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access_token);
        this.isAuthenticated.set(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.isAuthenticated.set(false);
  }

  getToken(): string | null {
    const token = localStorage.getItem('access_token');
    if (token) {
      return token;      
    }
    return null;
  }
  
}
