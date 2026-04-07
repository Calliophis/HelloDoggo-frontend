import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { Dog } from '../../../core/dogs/dog.model';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AdoptApplicationStateService } from '../../../core/adoptions/adopt-application-state.service';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DeleteDialogComponent } from '../../user/components/delete-dialog/delete-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthenticationStateService } from '../../../core/authentication/services/authentication-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dog-modal',
  imports: [
    DynamicDialogModule,
    ScrollPanelModule,
    IconFieldModule,
    ButtonModule,
  ],
  templateUrl: './dog-modal.component.html'
})
export class DogModalComponent {
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  deleteRef = signal<DynamicDialogRef | null>(null);

  #adoptApplicationStateService = inject(AdoptApplicationStateService);
  #authenticationStateService = inject(AuthenticationStateService);
  #dialogService = inject(DialogService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);

  dog = signal<Dog>(this.config.data.dog);
  application = computed(() => this.#adoptApplicationStateService.ownApplications().find(application => application.dog.id === this.dog().id) || null);
  isLoading = signal<boolean>(false);

  close(): void {
    this.ref.close();
  }

  adoptDog(id: string): void {
    if (!this.#authenticationStateService.isAuthenticated()) {
      this.#router.navigateByUrl('/auth/login');
      this.ref.close();
      return;
    }
    this.isLoading.set(true);
    this.#adoptApplicationStateService.createAdoptApplication({ dogId: id }).subscribe({
      next: () => {
        this.ref.close();
      },
      error: () => this.isLoading.set(false)
    });
  }

  showDeleteDialog(): void {
    const deleteRef = this.#dialogService.open(DeleteDialogComponent, {
      header: 'Are you sure?',
      width: '20rem',
      closable: true,
      closeOnEscape: true,
      dismissableMask: true
    });

    deleteRef?.onClose.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((confirmed) => {
      if (confirmed) {
        this.cancelApplication();
      }
    })
  }

  cancelApplication(): void {
    this.isLoading.set(true);
    this.#adoptApplicationStateService.deleteOwnAdoptApplication(this.dog().id).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.deleteRef()?.close();
      },
      error: () => this.isLoading.set(false)
    });
  }
}
