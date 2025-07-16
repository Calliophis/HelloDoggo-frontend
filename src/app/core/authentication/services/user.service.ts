import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/user.model';

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

  deleteOwnAccount() {
    return this.http.delete('http://localhost:3000/user/me');
  }

}
