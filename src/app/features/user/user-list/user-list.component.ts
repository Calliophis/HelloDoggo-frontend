import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../core/authentication/services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { Role } from '../../../core/authentication/models/role.type';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  imports: [
    ProgressSpinnerModule,
    SelectModule,
    ButtonModule,
    TableModule,
    FormsModule,
  ],
  templateUrl: './user-list.component.html'
})
export class UserListComponent {
  private userService = inject(UserService);

  users = this.userService.users;
  user = this.userService.user;
  roles = signal<Role[]>(['admin', 'editor', 'user']);

  isLoading = signal(false);

  constructor() {
    if (this.users().length > 0) return;
    this.isLoading.set(true);
    this.userService.initAllUsers().pipe(takeUntilDestroyed()).subscribe({
      next: () => {
        this.isLoading.set(false);
      }
    })
  }

  loadMoreUsers() {
    if (this.userService.hasMoreUsers()) {
      this.userService.loadMoreUsers().subscribe();
    }
  }

  checkIfOwnRole(userId: number): boolean {
    return this.user()?.id === userId;
  }

  changeRole(userId: number, role: Role) {
    this.userService.updateUserById(userId, {role}).subscribe();
  }
}
