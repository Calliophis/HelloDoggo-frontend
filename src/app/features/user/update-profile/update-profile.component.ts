import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { User } from '../../../core/authentication/models/user.model';
import { AuthenticationService } from '../../../core/authentication/services/authentication.service';
import { UserService } from '../../../core/authentication/services/user.service';
import { ErrorMessageService } from '../../../core/error-message.service';
import { confirmPasswordValidator } from '../../../shared/validators/confirm-password.validator';
import { WhiteSpaceValidator } from '../../../shared/validators/white-space.validator';
import { PasswordInputComponent } from '../components/password-input/password-input.component';

@Component({
  selector: 'app-update-profile',
  imports: [
    PasswordInputComponent,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    CardModule
  ],
  templateUrl: './update-profile.component.html'
})
export class UpdateProfileComponent {

  private errorMessageService = inject(ErrorMessageService);
  private userService = inject(UserService);
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);

  user = signal<User | null>(null);
  hasBeenSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isVisible = false;

  updateForm = new FormGroup({
      firstName: new FormControl('', { validators: [Validators.minLength(2), WhiteSpaceValidator()] }),
      lastName: new FormControl('', { validators: [Validators.minLength(2), WhiteSpaceValidator()] }),
      email: new FormControl('', { validators: [Validators.email] }),
      password: new FormControl(),
      confirmPassword: new FormControl()
  }, confirmPasswordValidator());

  constructor() {
    this.userService.getUser().pipe(
      tap(userResponse => this.user.set(userResponse)))
      .subscribe()
  }

  getErrorText(control: AbstractControl): string | null {
    return this.errorMessageService.getErrorText(control);
  }

  filterUpdateForm(): Partial<User> {
    const formValue = this.updateForm.value;
    const filteredForm: Partial<User> = Object.fromEntries(
      Object.entries(formValue).filter(([key, value]) => key !== 'confirmPassword' && value !== null && value !== '')
    );

    return filteredForm;
  }

  onSubmit() {
    this.hasBeenSubmitted.set(true);

    if (this.updateForm.invalid) {
      return;
    }
    
    this.isLoading.set(true);
    this.updateForm.disable();
    this.errorMessage.set(null);
    this.successMessage.set(null);
    
    const updatedUser = this.filterUpdateForm();
    
    return this.userService.updateUser(updatedUser).subscribe({
      next: () => {
        this.successMessage.set('Information updated');
        setTimeout(() => {
          this.isLoading.set(false);
          this.updateForm.enable();
          this.successMessage.set(null);
        }, 1000);
      },
      error: (error) => {
        this.updateForm.enable();
        this.isLoading.set(false);
        if (error.status === 401) {
          this.errorMessage.set('This update is not allowed');
        } else {
        this.errorMessage.set('An error occured. Please try later');
        }
      }
    });
  }

  onShowDialog() {
    this.isVisible = true;
  }

  onCancel() {
    this.isVisible = false;
  }

  onDelete() {
    this.isLoading.set(true);
    return this.userService.deleteOwnAccount().subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isVisible = false;
        this.successMessage.set('Account deleted');
        setTimeout(() => {
          this.successMessage.set(null);
          this.authenticationService.logout();
          this.router.navigateByUrl('/dog/all');
        }, 1000);
      },
      error: () => {
        this.isLoading.set(false);
        this.isVisible = false;
        this.errorMessage.set('An error occured. Please try later')
      }
    }); 
  }
}
