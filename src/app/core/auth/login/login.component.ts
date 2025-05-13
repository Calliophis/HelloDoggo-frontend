import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../service/auth.service';

interface LoginForm {  email: FormControl<string | null>;  password: FormControl<string | null>;}

@Component({
  selector: 'app-login',
  imports: [
    CardModule,
    ReactiveFormsModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  private authService = inject(AuthService);

  loginForm: FormGroup = new FormGroup<LoginForm>({
    email: new FormControl('', { validators: [Validators.email, Validators.required] }),
    password: new FormControl('', { validators: Validators.required })
  });

  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  hasBeenSubmitted = signal<boolean>(false);

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  onSubmit() {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.hasBeenSubmitted.set(true);
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }
    
    return this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.successMessage.set('Successfully logged in');
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage.set('Incorrect email or password');
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
      return 'Invalid email';
    }

    return null;
  }
}
