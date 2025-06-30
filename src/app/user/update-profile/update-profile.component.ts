import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WhiteSpaceValidator } from '../../shared/validators/white-space.validator';
import { confirmPasswordValidator } from '../../shared/validators/confirm-password.validator';
import { User } from '../../shared/models/user.model';
import { tap } from 'rxjs';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { PasswordInputComponent } from '../../core/auth/password-input/password-input.component';
import { UserService } from '../service/user.service';
import { AuthService } from '../../core/auth/service/auth.service';
import { ErrorMessageService } from '../../shared/services/error-message.service';
import { Router } from '@angular/router';

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
  private authService = inject(AuthService);
  private router = inject(Router);

  user = signal<User | null>(null);
  hasBeenSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isVisible: boolean = false;

  updateForm: FormGroup = new FormGroup({
      firstName: new FormControl('', { validators: [Validators.minLength(2), WhiteSpaceValidator()] }),
      lastName: new FormControl('', { validators: [Validators.minLength(2), WhiteSpaceValidator()] }),
      email: new FormControl('', { validators: [Validators.email] }),
      password: new FormControl(),
      confirmPassword: new FormControl()
  }, confirmPasswordValidator());

  get firstName(): AbstractControl | null {
    return this.updateForm.get('firstName');
  }

  get lastName(): AbstractControl | null {
    return this.updateForm.get('lastName');
  }

  get email(): AbstractControl | null {
    return this.updateForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.updateForm.get('password');
  }

  get confirmPassword(): AbstractControl | null {
    return this.updateForm.get('confirmPassword');
  }

  constructor() {
    this.userService.getUser().pipe(
      tap(res => this.user.set(res)))
      .subscribe()
  }

  getErrorText(control: AbstractControl | null): string | null {
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
      error: (err) => {
        this.updateForm.enable();
        this.isLoading.set(false);
        if (err.status === 401) {
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
          this.authService.logout();
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
