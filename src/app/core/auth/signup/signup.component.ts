import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../service/auth.service';
import { WhiteSpaceValidator } from '../../../shared/validators/white-space.validator';
import { PasswordInputComponent } from '../password-input/password-input.component';
import { confirmPasswordValidator } from '../../../shared/validators/confirm-password.validator';
import { SignupForm } from '../../../shared/models/signup-form.model';
import { SignupDto } from '../dto/signup.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [
    CardModule,
    ReactiveFormsModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    PasswordInputComponent,
    FormsModule
  ],
  templateUrl: './signup.component.html'
})
export class SignupComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  strongPasswordRegex: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

  signupForm: FormGroup = new FormGroup<SignupForm>({
    firstName: new FormControl('', { validators: [Validators.required, Validators.minLength(2), WhiteSpaceValidator()] }),
    lastName: new FormControl('', { validators: [Validators.required, Validators.minLength(2), WhiteSpaceValidator()] }),
    email: new FormControl('', { validators: [Validators.email, Validators.required] }),
    password: new FormControl('', { validators: [Validators.required] }),
    confirmPassword: new FormControl('', { validators: [Validators.required] })
  }, confirmPasswordValidator());

  get firstName(): AbstractControl | null {
    return this.signupForm.get('firstName');
  }

  get lastName(): AbstractControl | null {
    return this.signupForm.get('lastName');
  }

  get email(): AbstractControl | null {
    return this.signupForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.signupForm.get('password');
  }

  get confirmPassword(): AbstractControl | null {
    return this.signupForm.get('confirmPassword');
  }

  hasBeenSubmitted = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string |null>(null);
  filteredForm = signal<SignupDto>({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  

  onSubmit() {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.hasBeenSubmitted.set(true);
    this.signupForm.markAllAsTouched();

    if (this.signupForm.invalid) {
      return;
    }

    this.filteredForm.set(
{
      firstName: this.signupForm.value.firstName,
      lastName: this.signupForm.value.lastName,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    }
    )
    
    return this.authService.signup(this.filteredForm()).subscribe({
      next: () => {
        this.successMessage.set('Account created');
        setTimeout(() => this.router.navigateByUrl('/user/me'), 400);
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage.set('This email is already used')
        } else {
        this.errorMessage.set('An error occured. Please try later');
        }
      }
    });
  }

  getErrorText(control: AbstractControl | null): string | null {
    if (!control) {
      return null;
    }

    if (control.hasError('required')) {
      return 'This field is required';
    }
    
    if (control.hasError('email')) {
      return 'Email is not valid';
    }

    if (control.hasError('isOnlyWhiteSpace')) {
      return 'This field cannot be white space';
    }

    if (control.hasError('isWeakPassword')) {
      return 'Password is too weak';
    }

    if (control.hasError('passwordDoesNotMatch')) {
      return 'Password does not match';
    }

    return null;
  }

}
