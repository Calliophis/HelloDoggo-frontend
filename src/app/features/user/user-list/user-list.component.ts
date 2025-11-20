import { Component, DestroyRef, inject, signal } from '@angular/core';
import { UserService } from '../../../core/authentication/services/user.service';
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

  #userService = inject(UserService);
  #destroyRef = inject(DestroyRef);
  dialogService = inject(DialogService);

  users = this.#userService.users;
  user = this.#userService.user;
  roles = signal<Role[]>(['admin', 'editor', 'user']);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor() {
    this.isLoading.set(true);
    if (this.users().length > 0) {
      this.#userService.refreshUsers().subscribe({
        next: () => {
          this.isLoading.set(false);
        }
      })
    } else {
      this.#userService.initAllUsers().pipe(takeUntilDestroyed()).subscribe({
        next: () => {
          this.isLoading.set(false);
        }
      })
    } 
  }

  loadMoreUsers() {
    if (this.#userService.hasMoreUsers()) {
      this.#userService.loadMoreUsers().subscribe();
    }
  }

  checkIfOwnRole(userId: string): boolean {
    return this.user()?.id === userId;
  }

  changeRole(userId: string, role: Role) {
    this.#userService.updateUserById(userId, {role}).subscribe();
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
    return this.#userService.deleteUser(id).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
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
