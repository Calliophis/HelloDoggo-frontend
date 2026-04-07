import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AdoptApplicationStateService } from '../../../core/adoptions/adopt-application-state.service';
import { Status } from '../../../core/adoptions/models/status.type';
import { AdoptApplication } from '../../../core/adoptions/models/adopt-application.model';
import { DialogService } from 'primeng/dynamicdialog';
import { DeleteDialogComponent } from '../../user/components/delete-dialog/delete-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-adoptions',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule, SelectModule, ProgressSpinnerModule, FormsModule],
  templateUrl: './admin-adoptions.component.html',
})
export class AdminAdoptionsComponent {
  #adoptState = inject(AdoptApplicationStateService);
  #dialogService = inject(DialogService);
  #destroyRef = inject(DestroyRef);

  applications = this.#adoptState.adoptApplications;

  isLoading = signal(false);
  selectedDogId = signal<string | null>(null);
  selectedUserId = signal<string | null>(null);

  statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' }
  ];

  constructor() {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading.set(true);
    this.#adoptState.initAllAdoptApplications().subscribe(() => this.isLoading.set(false));
  }

  getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'info';
      case 'rejected': return 'danger';
      default: return 'info';
    }
  }

  isDogAlreadyApproved(dogId: string, currentId: string): boolean {
    return this.applications().some(application => application.dog.id === dogId && application.id !== currentId && application.status === 'approved');
  }

  getFilteredStatusOptions(application: AdoptApplication) {
    const isAlreadyApproved = this.isDogAlreadyApproved(application.dog.id, application.id);

    return this.statusOptions.map(option => ({
      ...option,
      disabled: option.value === 'approved' && isAlreadyApproved
    }));
  }

  updateStatus(id: string, status: Status): void {
    this.#adoptState.updateAdoptApplication(id, { status }).subscribe();
  }

  showDeleteDialog(id: string): void {
    const deleteRef = this.#dialogService.open(DeleteDialogComponent, {
      header: 'Are you sure?',
      width: '20rem',
      closable: true,
      closeOnEscape: true,
      dismissableMask: true
    });

    deleteRef?.onClose.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((confirmed) => {
      if (confirmed) {
        this.deleteApplication(id);
      }
    });
  }

  deleteApplication(id: string): void {
    this.#adoptState.deleteAdoptApplication(id).subscribe();
  }
}
