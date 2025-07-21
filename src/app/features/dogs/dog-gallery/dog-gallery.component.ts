import { Component, inject, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DogCardComponent } from '../dog-card/dog-card.component';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/authentication/services/authentication.service';
import { DogService } from '../../../core/dogs/dog.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);

  dogs = this.dogService.dogs;
  role = this.authenticationService.role;

  isLoading = signal(false);

  constructor() {
    this.isLoading.set(true);
    this.dogService.initDogs().pipe(takeUntilDestroyed()).subscribe({
      next: () => {
        this.isLoading.set(false);
      }
    });
  }

  createDog() {
    this.router.navigateByUrl('/dog/create');
  }
}
