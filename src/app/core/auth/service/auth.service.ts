import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LoginDto } from '../dto/login.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  login(user: LoginDto) {
    return this.http.post<{ access_token: string }>('http://localhost:3000/auth/login', user).pipe(
      tap(res => localStorage.setItem('access_token', res.access_token))
    );
  }
}
