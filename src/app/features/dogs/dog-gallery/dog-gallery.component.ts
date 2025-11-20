import { Component, inject, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DogCardComponent } from '../dog-card/dog-card.component';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/authentication/services/authentication.service';
import { DogService } from '../../../core/dogs/dog.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IntersectionObserverDirective } from '../../../shared/directives/intersection-observer.directive';

@Component({
  selector: 'app-dog-gallery',
  imports: [
    IntersectionObserverDirective,
    ProgressSpinnerModule,
    DogCardComponent,
    ButtonModule,
],
  templateUrl: './dog-gallery.component.html'
})
export class DogGalleryComponent {

  #dogService = inject(DogService);
  #authenticationService = inject(AuthenticationService);
  #router = inject(Router);

  dogs = this.#dogService.dogs;
  role = this.#authenticationService.role;

  isLoading = signal(false);

  constructor() {
    if (this.dogs().length > 0) return;
    this.isLoading.set(true);
    this.#dogService.initDogs().pipe(takeUntilDestroyed()).subscribe({
      next: () => {
        this.isLoading.set(false);
      }
    });
  }

  createDog() {
    this.#router.navigateByUrl('/dog/create');
  }

  loadMoreDogs() {
    if (this.#dogService.dogs().length > 0 && this.#dogService.hasMoreDogs()) {
      this.#dogService.loadMoreDogs().subscribe();
    }
  }
}
