import { Component, inject, signal } from '@angular/core';
import { DogService } from '../service/dog.service';
import { Dog } from '../../shared/models/dog.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DogCardComponent } from '../dog-card/dog-card.component';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/auth/service/auth.service';
import { Role } from '../../shared/enums/role.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dog-gallery',
  imports: [
    ProgressSpinnerModule,
    DogCardComponent,
    ButtonModule,
  ],
  templateUrl: './dog-gallery.component.html'
})
export class DogGalleryComponent {

  private dogService = inject(DogService);
  private authService = inject(AuthService);
  private router = inject(Router);

  dogs = signal<Dog[] | null>(null);
  isLoading = signal<boolean>(false);
  role = signal<Role | null>(this.authService.role());

  constructor() {
    this.isLoading.set(true)
    this.dogService.getAllDogs().subscribe({
      next: res => {
        this.dogs.set(res);
        this.isLoading.set(false);  
      }
    })
  }

  onCreateDog() {
    this.router.navigateByUrl('/dog/create');
  }
}
