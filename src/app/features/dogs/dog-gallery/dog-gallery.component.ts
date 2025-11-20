import { Component, inject, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DogCardComponent } from '../dog-card/dog-card.component';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/authentication/services/authentication.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IntersectionObserverDirective } from '../../../shared/directives/intersection-observer.directive';
import { DogStateService } from '../../../core/dogs/dog-state.service';

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
  #dogStateService = inject(DogStateService);
  #authenticationService = inject(AuthenticationService);
  #router = inject(Router);

  dogs = this.#dogStateService.dogs;
  role = this.#authenticationService.role;

  isLoading = signal(false);

  constructor() {
    if (this.dogs().length > 0) return;
    this.isLoading.set(true);
    this.#dogStateService.initDogs().pipe(takeUntilDestroyed()).subscribe({
      next: () => {
        this.isLoading.set(false);
      }
    });
  }

  createDog() {
    this.#router.navigateByUrl('/dog/create');
  }

  loadMoreDogs() {
    if (this.#dogStateService.dogs().length > 0 && this.#dogStateService.hasMoreDogs()) {
      this.#dogStateService.loadMoreDogs().subscribe();
    }
  }
}
