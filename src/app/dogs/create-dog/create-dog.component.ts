import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CreateDogForm } from '../../shared/models/create-dog-form';
import { WhiteSpaceValidator } from '../../shared/validators/white-space.validator';
import { DogService } from '../service/dog.service';
import { ImageInputComponent } from '../../shared/components/image-input/image-input.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessageModule } from 'primeng/message';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorMessageService } from '../../shared/services/error-message.service';

@Component({
  selector: 'app-create-dog',
  imports: [
    ImageInputComponent,
    ReactiveFormsModule,
    RadioButtonModule,
    FloatLabelModule,
    InputTextModule,
    MessageModule,
    CommonModule,
    ButtonModule,
    FormsModule,
    CardModule
  ],
  templateUrl: './create-dog.component.html'
})
export class CreateDogComponent {
  private errorMessageService = inject(ErrorMessageService);
  private dogService = inject(DogService);
  private router = inject(Router);

  hasBeenSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string |null>(null);

  createDogForm: FormGroup = new FormGroup<CreateDogForm>({
    name: new FormControl('', { validators: [Validators.required, Validators.minLength(2), WhiteSpaceValidator()] }),
    sex: new FormControl(null, { validators: [Validators.required, Validators.minLength(2), WhiteSpaceValidator()] }),
    breed: new FormControl('', { validators: [Validators.required, Validators.minLength(2), WhiteSpaceValidator()] }),
    description: new FormControl('', { validators: [Validators.required, Validators.minLength(2), WhiteSpaceValidator()] }),
    image: new FormControl('', { validators: Validators.required })
  })

  get name(): AbstractControl | null {
    return this.createDogForm.get('name');
  }

  get sex(): AbstractControl | null {
    return this.createDogForm.get('sex');
  }

  get breed(): AbstractControl | null {
    return this.createDogForm.get('breed');
  }

  get description(): AbstractControl |null {
    return this.createDogForm.get('description');
  }

  getErrorText(control: AbstractControl | null): string | null {
    return this.errorMessageService.getErrorText(control);
  }

  onSubmit() {
    this.hasBeenSubmitted.set(true);
    this.createDogForm.markAllAsTouched();

    if (this.createDogForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.createDogForm.disable();
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const formValue = this.createDogForm.value;
    const formData = new FormData();

    formData.append('name', formValue.name);
    formData.append('sex', formValue.sex);
    formData.append('breed', formValue.breed);
    formData.append('description', formValue.description);
    formData.append('image', formValue.image);
    
    return this.dogService.createDog(formData).subscribe({
      next: () => {
        this.successMessage.set('Dog created');
        setTimeout(() => {
          this.isLoading.set(false);
          this.router.navigateByUrl('/dog/all');
        }, 1000);
      },
      error: (err) => {
        this.createDogForm.enable();
        this.isLoading.set(false);
        if (this.createDogForm.invalid) {
          this.errorMessage.set(null)
        } else {
          this.errorMessage.set('An error occured. Please try later');
        }
      }
    });
  } 
}
