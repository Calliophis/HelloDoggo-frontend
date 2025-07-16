import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthenticationService } from '../../../core/authentication/services/authentication.service';
import { ErrorMessageService } from '../../../core/error-message.service';
import { Dog } from '../../../core/dogs/dog.model';

interface LoginForm {  email: FormControl<string>;  password: FormControl<string>;}

@Component({
  selector: 'app-login',
  imports: [
    ProgressSpinnerModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    PasswordModule,
    MessageModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  private authenticationService = inject(AuthenticationService);
  private errorMessageService = inject(ErrorMessageService);

  loginForm = new FormGroup<LoginForm>({
    email: new FormControl('', { validators: [Validators.email, Validators.required], nonNullable: true }),
    password: new FormControl('', { validators: Validators.required, nonNullable: true })
  });

  hasBeenSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  onSubmit() {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.hasBeenSubmitted.set(true);
    this.loginForm.markAllAsTouched();
    this.loginForm.disable();
    this.isLoading.set(true);

    if (this.loginForm.invalid) {
      return;
    }

    const loginDto = {
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value,
    }
    
    return this.authenticationService.login(loginDto).subscribe({
      next: () => {
        this.successMessage.set('Successfully logged in');
        setTimeout(() => {
          this.isLoading.set(false);
          window.history.back();
        }, 1000)
      },
      error: (error) => {
        this.loginForm.enable();
        this.isLoading.set(false);
        if (error.status === 401) {
          this.errorMessage.set('Incorrect email or password');
        } else {
          this.errorMessage.set('An error occured. Please try later');
        }
      }
    });
  }

  getErrorText(control: AbstractControl): string | null {
    return this.errorMessageService.getErrorText(control);
  } 
}
