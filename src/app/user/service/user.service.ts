import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private http = inject(HttpClient);

  getUser() {
    return this.http.get<User>('http://localhost:3000/user/me');
  }

  updateUser(updatedUser: Partial<User>) {
    return this.http.patch(`http://localhost:3000/user/me`, updatedUser);
  }

}
