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
import { AdoptApplicationStateService } from '../../../core/adoptions/adopt-application-state.service';

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
  #adoptApplicationStateService = inject(AdoptApplicationStateService);
  #dialogService = inject(DialogService);

  dogs = this.#dogStateService.dogs;
  role = this.#authenticationStateService.role;
  applications = this.#adoptApplicationStateService.ownApplications;

  isLoading = signal(false);

  constructor() {
    if (this.dogs().length > 0) return;
    this.isLoading.set(true);
    if (this.#authenticationStateService.isAuthenticated()) {
      this.#adoptApplicationStateService.initOwnAdoptApplications().pipe(takeUntilDestroyed()).subscribe();
    }
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
    if (this.#dogStateService.dogs().length > 0 && this.#dogStateService.hasMore()) {
      this.#dogStateService.loadMoreDogs().subscribe();
    }
  }
}
