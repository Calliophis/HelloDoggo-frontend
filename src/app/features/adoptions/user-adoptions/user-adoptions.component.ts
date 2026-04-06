import { Component, inject, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { AdoptApplicationStateService } from '../../../core/adoptions/adopt-application-state.service';
import { DogStateService } from '../../../core/dogs/dog-state.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-adoptions',
  standalone: true,
  imports: [TableModule, TagModule, ButtonModule, ProgressSpinnerModule, CommonModule, RouterLink],
  templateUrl: './user-adoptions.component.html',
})
export class UserAdoptionsComponent {
  #adoptState = inject(AdoptApplicationStateService);
  #dogState = inject(DogStateService);

  applications = this.#adoptState.adoptApplications;
  isLoading = signal(false);

  constructor() {
    this.isLoading.set(true);
    this.#adoptState.initOwnAdoptApplications().subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
    this.#dogState.initDogs().subscribe();
  }

  getDogName(dogId: string): string {
    return this.#dogState.dogs().find(dog => dog.id === dogId)?.name || 'Unknown Dog';
  }

  getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'info';
      case 'rejected': return 'danger';
      default: return 'info';
    }
  }

  cancelApplication(dogId: string): void {
    this.#adoptState.deleteOwnAdoptApplication(dogId).subscribe();
  }
}
