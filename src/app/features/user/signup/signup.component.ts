import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { WhiteSpaceValidator } from '../../../shared/validators/white-space.validator';
import { confirmPasswordValidator } from '../../../shared/validators/confirm-password.validator';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/authentication/services/authentication.service';
import { ErrorMessageService } from '../../../core/error-message.service';
import { PasswordInputComponent } from '../components/password-input/password-input.component';
import { SignupForm } from './signup-form.model';

@Component({
  selector: 'app-signup',
  imports: [
    PasswordInputComponent,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    ButtonModule,
    FormsModule,
    CardModule, 
  ],
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  private errorMessageService = inject(ErrorMessageService)
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);

  signupForm = new FormGroup<SignupForm>({
    firstName: new FormControl('', { validators: [Validators.required, Validators.minLength(2), WhiteSpaceValidator()], nonNullable: true }),
    lastName: new FormControl('', { validators: [Validators.required, Validators.minLength(2), WhiteSpaceValidator()], nonNullable: true }),
    email: new FormControl('', { validators: [Validators.email, Validators.required], nonNullable: true }),
    password: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    confirmPassword: new FormControl('', { validators: [Validators.required], nonNullable: true })
  }, confirmPasswordValidator());

  hasBeenSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  errorMessage = signal<string | null>(null);
  successMessage = signal<string |null>(null);
  
  getErrorText(control: AbstractControl): string | null {
   return this.errorMessageService.getErrorText(control);
  }

  onSubmit() {
    this.hasBeenSubmitted.set(true);
    this.signupForm.markAllAsTouched();

    if (this.signupForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.signupForm.disable();
    this.errorMessage.set(null);
    this.successMessage.set(null);

    
    const filteredForm = {
      firstName: this.signupForm.controls.firstName.value,
      lastName: this.signupForm.controls.lastName.value,
      email: this.signupForm.controls.email.value,
      password: this.signupForm.controls.password.value,
    }
    
    return this.authenticationService.signup(filteredForm).subscribe({
      next: () => {
        this.successMessage.set('Account created');
        setTimeout(() => {
          this.isLoading.set(false);
          this.router.navigateByUrl('/user/me');
        }, 1000);
      },
      error: (error) => {
        this.signupForm.enable();
        this.isLoading.set(false);

        if (error.status === 401) {
          this.errorMessage.set('This email is already used')
        } else {
        this.errorMessage.set('An error occured. Please try later');
        }
      }
    });
  }
}
