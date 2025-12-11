import { Component, DestroyRef, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessageModule } from 'primeng/message';
import { Router } from '@angular/router';

import { ImageInputComponent } from '../../../shared/components/image-input/image-input.component';
import { ErrorMessageService } from '../../../core/error-message.service';
import { WhiteSpaceValidator } from '../../../shared/validators/white-space.validator';
import { CreateDogForm } from './create-dog-form.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DogStateService } from '../../../core/dogs/dog-state.service';

@Component({
  selector: 'app-create-dog',
  imports: [
    ImageInputComponent,
    ReactiveFormsModule,
    RadioButtonModule,
    FloatLabelModule,
    InputTextModule,
    MessageModule,
    ButtonModule,
    FormsModule,
    CardModule
],
  templateUrl: './create-dog.component.html'
})
export class CreateDogComponent {
  #dogStateService = inject(DogStateService);

  #errorMessageService = inject(ErrorMessageService);
  #router = inject(Router);
  #destroyRef = inject(DestroyRef);

  hasBeenSubmitted = signal(false);
  isLoading = signal(false);  
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  createDogForm = new FormGroup<CreateDogForm>({
    name: new FormControl('', { validators: [Validators.required, Validators.minLength(2), WhiteSpaceValidator()], nonNullable: true }),
    sex: new FormControl(null, { validators: Validators.required, nonNullable: true }),
    breed: new FormControl('', { validators: [Validators.required, Validators.minLength(2), WhiteSpaceValidator()], nonNullable: true }),
    description: new FormControl('', { validators: [Validators.required, Validators.minLength(2), WhiteSpaceValidator()], nonNullable: true }),
    image: new FormControl(null, { validators: Validators.required, nonNullable: true })
  })

  getErrorText(control: AbstractControl): string | null {
    return this.#errorMessageService.getErrorText(control);
  }

  onSubmit() {
    this.hasBeenSubmitted.set(true);
    this.createDogForm.markAllAsTouched();

    if (this.createDogForm.invalid) {
      return;
    }

    this.createDogForm.disable();
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.isLoading.set(true);

    return this.#dogStateService.createDog(this.createDogForm).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Dog created');
        setTimeout(() => {
          this.#router.navigateByUrl('/dog/all');
        }, 1000);
      },
      error: () => {
        this.isLoading.set(false);
        this.createDogForm.enable();
        if (this.createDogForm.invalid) {
          this.errorMessage.set(null)
        } else {
          this.errorMessage.set('An error occured. Please try later');
        }
      }
    });
  } 
}
