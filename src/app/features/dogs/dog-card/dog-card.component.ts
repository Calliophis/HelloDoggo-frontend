import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UpdateDogComponent } from '../update-dog/update-dog.component';
import { AuthenticationStateService } from '../../../core/authentication/services/authentication-state.service';
import { Dog } from '../../../core/dogs/dog.model';
import { DogModalComponent } from '../dog-modal/dog-modal.component';
import { DeleteDialogComponent } from '../../user/components/delete-dialog/delete-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DogStateService } from '../../../core/dogs/dog-state.service';

@Component({
  selector: 'app-dog-card',
  imports: [
    DynamicDialogModule,
    IconFieldModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './dog-card.component.html'
})
export class DogCardComponent {
  #authenticationStateService = inject(AuthenticationStateService);
  #dogStateService = inject(DogStateService);
  #dialogService = inject(DialogService);
  #destroyRef = inject(DestroyRef);

  deleteRef = signal<DynamicDialogRef | null>(null);

  dog = input.required<Dog>();
  role = this.#authenticationStateService.role;
  isLoading = signal(false);

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

  showDeleteDialog(dog: Dog, event: Event) {
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
      data: {
        dog
      },
      closable: true,
      closeOnEscape: true,
      dismissableMask: true,
      showHeader: false,
    })
  }

  deleteDog(): void {
    this.isLoading.set(true);
    this.#dogStateService.deleteDog(this.dog().id).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: () => this.deleteRef()?.close()
    });
  }
}
