import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AdoptApplicationStateService } from '../../../core/adoptions/adopt-application-state.service';
import { DogStateService } from '../../../core/dogs/dog-state.service';
import { UserStateService } from '../../../core/authentication/services/user-state.service';
import { Status } from '../../../core/adoptions/models/status.type';
import { AdoptApplication } from '../../../core/adoptions/models/adopt-application.model';

@Component({
  selector: 'app-admin-adoptions',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule, SelectModule, ProgressSpinnerModule, FormsModule],
  templateUrl: './admin-adoptions.component.html',
})
export class AdminAdoptionsComponent {
  #adoptState = inject(AdoptApplicationStateService);
  #dogState = inject(DogStateService);
  #userState = inject(UserStateService);

  applications = this.#adoptState.adoptApplications;
  dogs = this.#dogState.dogs;
  users = this.#userState.users;

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
    this.#dogState.initDogs().subscribe();
    this.#userState.getAllUsers().subscribe();
  }

  getDogName(dogId: string): string {
    return this.dogs().find(d => d.id === dogId)?.name || 'Unknown Dog';
  }

  getUserName(userId: string): string {
    const user = this.users().find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
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
    return this.applications().some(application => application.dogId === dogId && application.id !== currentId && application.status === 'approved');
  }

  getFilteredStatusOptions(application: AdoptApplication) {
    const isAlreadyApproved = this.isDogAlreadyApproved(application.dogId, application.id);

    return this.statusOptions.map(option => ({
      ...option,
      disabled: option.value === 'approved' && isAlreadyApproved
    }));
  }

  updateStatus(id: string, status: Status): void {
    this.#adoptState.updateAdoptApplication(id, { status }).subscribe();
  }

  deleteApplication(id: string): void {
    this.#adoptState.deleteAdoptApplication(id).subscribe();
  }
}
