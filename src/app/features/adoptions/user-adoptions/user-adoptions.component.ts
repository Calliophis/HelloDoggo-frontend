import { Component, DestroyRef, inject, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { AdoptApplicationStateService } from '../../../core/adoptions/adopt-application-state.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { DeleteDialogComponent } from '../../user/components/delete-dialog/delete-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-adoptions',
  standalone: true,
  imports: [TableModule, TagModule, ButtonModule, ProgressSpinnerModule, CommonModule, RouterLink],
  templateUrl: './user-adoptions.component.html',
})
export class UserAdoptionsComponent {
  #adoptState = inject(AdoptApplicationStateService);
  #dialogService = inject(DialogService);
  #destroyRef = inject(DestroyRef);

  applications = this.#adoptState.ownApplications;
  isLoading = signal(false);

  constructor() {
    this.isLoading.set(true);
    this.#adoptState.initOwnAdoptApplications().subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
  }

  getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'info';
      case 'rejected': return 'danger';
      default: return 'info';
    }
  }

  showDeleteDialog(dogId: string): void {
    const deleteRef = this.#dialogService.open(DeleteDialogComponent, {
      header: 'Are you sure?',
      width: '20rem',
      closable: true,
      closeOnEscape: true,
      dismissableMask: true
    });

    deleteRef?.onClose.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((confirmed) => {
      if (confirmed) {
        this.cancelApplication(dogId);
      }
    });
  }

  cancelApplication(dogId: string): void {
    this.isLoading.set(true);
    this.#adoptState.deleteOwnAdoptApplication(dogId).subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
  }
}
