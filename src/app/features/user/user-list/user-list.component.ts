import { Component, DestroyRef, inject, signal } from '@angular/core';
import { UserStateService } from '../../../core/authentication/services/user-state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { Role } from '../../../core/authentication/models/role.type';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { DeleteDialogComponent } from '../components/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-user-list',
  imports: [
    ProgressSpinnerModule,
    MessageModule,
    SelectModule,
    ButtonModule,
    DialogModule,
    TableModule,
    FormsModule,
  ],
  providers: [DialogService],
  templateUrl: './user-list.component.html'
})
export class UserListComponent {
  ref: DynamicDialogRef | undefined;

  #userStateService = inject(UserStateService);
  #destroyRef = inject(DestroyRef);
  dialogService = inject(DialogService);

  users = this.#userStateService.users;
  user = this.#userStateService.user;
  roles = signal<Role[]>(['admin', 'editor', 'user']);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor() {
    this.isLoading.set(true);
    if (this.users().length > 0) {
      this.#userStateService.refreshUsers().subscribe({
        next: () => {
          this.isLoading.set(false);
        }
      })
    } else {
      this.#userStateService.initAllUsers().pipe(takeUntilDestroyed()).subscribe({
        next: () => {
          this.isLoading.set(false);
        }
      })
    } 
  }

  loadMoreUsers() {
    if (this.#userStateService.hasMoreUsers()) {
      this.#userStateService.loadMoreUsers().subscribe();
    }
  }

  checkIfOwnRole(userId: string): boolean {
    return this.user()?.id === userId;
  }

  changeRole(userId: string, role: Role) {
    this.#userStateService.updateUserById(userId, {role}).subscribe();
  }

  showDialog(id: string) {
    this.ref = this.dialogService.open(DeleteDialogComponent, {
      header: 'Are you sure?',
      width: '20rem',
      modal: true, 
    });

    this.ref.onClose.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((confirmed) => {
      if (confirmed) {
        this.deleteUser(id);
      }
    }) 
  }

  deleteUser(id: string) {
    this.isLoading.set(true);
    return this.#userStateService.deleteUser(id).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Accound deleted');
        setTimeout(() => this.successMessage.set(null), 1000);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('An error occured. Please try later');
      }
    });
  }
}
