import { Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UpdateDogComponent } from '../update-dog/update-dog.component';
import { AuthenticationStateService } from '../../../core/authentication/services/authentication-state.service';
import { Dog } from '../../../core/dogs/dog.model';
import { DogModalComponent } from '../dog-modal/dog-modal.component';
import { DeleteDialogComponent } from '../../user/components/delete-dialog/delete-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DogStateService } from '../../../core/dogs/dog-state.service';
import { AdoptApplicationStateService } from '../../../core/adoptions/adopt-application-state.service';

@Component({
  selector: 'app-dog-card',
  imports: [
    DynamicDialogModule,
    IconFieldModule,
    ButtonModule,
    CardModule,
    TagModule
  ],
  templateUrl: './dog-card.component.html'
})
export class DogCardComponent {
  #adoptApplicationStateService = inject(AdoptApplicationStateService);
  #authenticationStateService = inject(AuthenticationStateService);
  #dogStateService = inject(DogStateService);
  #dialogService = inject(DialogService);
  #destroyRef = inject(DestroyRef);

  deleteRef = signal<DynamicDialogRef | null>(null);

  dog = input.required<Dog>();
  role = this.#authenticationStateService.role;
  isLoading = signal(false);
  application = computed(() => this.#adoptApplicationStateService.ownApplications().find(application => application.dog.id === this.dog().id) || null);
  applicationStatus = computed(() => this.application()?.status ?? null);

  showUpdateDialog(dog: Dog, event: Event) {
    event.stopPropagation();
    this.#dialogService.open(UpdateDogComponent, {
      data: {
        dog
      },
      header: 'Update your dog information',
      width: '30rem',
      closable: true,
      closeOnEscape: true,
      dismissableMask: true
    });
  }

  showDeleteDialog(event: Event) {
    event.stopPropagation();
    const deleteRef = this.#dialogService.open(DeleteDialogComponent, {
      header: 'Are you sure?',
      width: '20rem',
      closable: true,
      closeOnEscape: true,
      dismissableMask: true
    });

    deleteRef?.onClose.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((confirmed) => {
      if (confirmed) {
        this.deleteDog();
      }
    })
  }

  showDogModal(dog: Dog) {
    this.#dialogService.open(DogModalComponent, {
      header: 'Doggo details',
      data: {
        dog
      },
      closable: true,
      closeOnEscape: true,
      dismissableMask: true,
    })
  }

  deleteDog(): void {
    this.isLoading.set(true);
    this.#dogStateService.deleteDog(this.dog().id).subscribe({
      next: () => this.deleteRef()?.close()
    });
  }
}
