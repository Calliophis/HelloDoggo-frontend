import { Component, inject, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DogCardComponent } from '../dog-card/dog-card.component';
import { ButtonModule } from 'primeng/button';
import { AuthenticationStateService } from '../../../core/authentication/services/authentication-state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IntersectionObserverDirective } from '../../../shared/directives/intersection-observer.directive';
import { DogStateService } from '../../../core/dogs/dog-state.service';
import { CreateDogComponent } from '../create-dog/create-dog.component';
import { DialogService } from 'primeng/dynamicdialog';

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
  #authenticationStateService = inject(AuthenticationStateService);
  #dialogService = inject(DialogService);

  dogs = this.#dogStateService.dogs;
  role = this.#authenticationStateService.role;

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

  showCreateDogDialog() {
    this.#dialogService.open(CreateDogComponent, {
      header: 'Add a new dog to adopt',
      width: '30rem',
      closable: true,
      closeOnEscape: true,
      dismissableMask: true
    });
  }

  loadMoreDogs() {
    if (this.#dogStateService.dogs().length > 0 && this.#dogStateService.hasMoreDogs()) {
      this.#dogStateService.loadMoreDogs().subscribe();
    }
  }
}
