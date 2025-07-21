import { Component, DestroyRef, inject, model, OnInit, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/authentication/services/authentication.service';
import { UserService } from '../../../core/authentication/services/user.service';
import { ErrorMessageService } from '../../../core/error-message.service';
import { confirmPasswordValidator } from '../../../shared/validators/confirm-password.validator';
import { WhiteSpaceValidator } from '../../../shared/validators/white-space.validator';
import { PasswordInputComponent } from '../components/password-input/password-input.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UpdateProfileForm } from './update-profile-form.model';

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
export class UpdateProfileComponent implements OnInit {

  private errorMessageService = inject(ErrorMessageService);
  private userService = inject(UserService);
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  user = this.userService.user;

  hasBeenSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  isVisible = model<boolean>(false);

  updateProfileForm = new FormGroup<UpdateProfileForm>({
      firstName: new FormControl('', { validators: [Validators.minLength(2), WhiteSpaceValidator()], nonNullable: true }),
      lastName: new FormControl('', { validators: [Validators.minLength(2), WhiteSpaceValidator()], nonNullable: true }),
      email: new FormControl('', { validators: [Validators.email], nonNullable: true }),
      password: new FormControl(),
      confirmPassword: new FormControl()
  }, confirmPasswordValidator());

  ngOnInit(): void {
    this.isLoading.set(true);
    this.userService.initUser().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.updateProfileForm.patchValue({
          firstName: this.user()?.firstName,
          lastName: this.user()?.lastName,
          email: this.user()?.email
        })
      }
    });
  }

  getErrorText(control: AbstractControl): string | null {
    return this.errorMessageService.getErrorText(control);
  }

  onSubmit() {
    this.hasBeenSubmitted.set(true);

    if (this.updateProfileForm.invalid) {
      return;
    }
    
    this.updateProfileForm.disable();
    this.errorMessage.set(null);
    this.successMessage.set(null);
    
    const updatedUser = this.userService.filterUpdateForm(this.updateProfileForm);
    
    this.isLoading.set(true);
    return this.userService.updateUser(updatedUser).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Information updated');
        setTimeout(() => {
          this.updateProfileForm.enable();
          this.successMessage.set(null);
        }, 1000);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.updateProfileForm.enable();
        if (error.status === 401) {
          this.errorMessage.set('This update is not allowed');
        } else {
        this.errorMessage.set('An error occured. Please try later');
        }
      }
    });
  }

  showDialog() {
    this.isVisible.set(true);
  }

  cancelDelete() {
    this.isVisible.set(false);
  }

  deleteProfile() {
    this.isLoading.set(true);
    return this.userService.deleteOwnAccount().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isVisible.set(false);
        this.successMessage.set('Account deleted');
        setTimeout(() => {
          this.successMessage.set(null);
          this.authenticationService.logout();
          this.router.navigateByUrl('/dog/all');
        }, 1000);
      },
      error: () => {
        this.isLoading.set(false);
        this.isVisible.set(false);
        this.errorMessage.set('An error occured. Please try later')
      }
    }); 
  }
}
