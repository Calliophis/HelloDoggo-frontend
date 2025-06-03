import { Component, inject, signal } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-profile',
  imports: [
    ButtonModule,
    CardModule,
  ],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  
  private http = inject(HttpClient);
  private router = inject(Router);
  private userService = inject(UserService);

  user = signal<User | null>(null);

  constructor() {
    this.userService.getUser().pipe(
        tap(res => this.user.set(res))
      ).subscribe()
  }
 
  onUpdateProfile() {
  }
}
