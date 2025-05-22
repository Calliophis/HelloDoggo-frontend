import { afterNextRender, Component, inject, signal } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [
    ButtonModule
  ],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  
  private http = inject(HttpClient);
  private router = inject(Router);

  user = signal<User | null>(null);

  constructor() {
    afterNextRender(() => {
      this.http.get<User>('http://localhost:3000/user/me').pipe(
        tap(res => this.user.set(res))
      ).subscribe()
    })
  }
 
  onUpdateProfile() {
  }
}
