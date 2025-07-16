import { Component, inject, input, model, OnInit, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Dog } from '../../../core/dogs/dog.model';
import { DogService } from '../../../core/dogs/dog.service';
import { ErrorMessageService } from '../../../core/error-message.service';
import { ImageInputComponent } from '../../../shared/components/image-input/image-input.component';
import { WhiteSpaceValidator } from '../../../shared/validators/white-space.validator';
import { DialogModule } from 'primeng/dialog';
import { UpdateDogForm } from './update-dog-form.model';

@Component({
  selector: 'app-update-dog',
  imports: [
    ImageInputComponent,
    ReactiveFormsModule,
    RadioButtonModule,
    FloatLabelModule,
    InputTextModule,
    MessageModule,
    DialogModule,
    CommonModule,
    ButtonModule,
    FormsModule,
    CardModule
  ],
  templateUrl: './update-dog.component.html'
})
export class UpdateDogComponent implements OnInit {
  private errorMessageService = inject(ErrorMessageService);
  private dogService = inject(DogService);
  
  dog = input.required<Dog>();
  submitEvent = output<void>();
  hasBeenSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string |null>(null);
  isVisible = model<boolean>(false);

  updateDogForm = new FormGroup<UpdateDogForm>({
    name: new FormControl('', { validators: [Validators.minLength(2), WhiteSpaceValidator()], nonNullable: true }),
    sex: new FormControl('male', { nonNullable: true }),
    breed: new FormControl('', { validators: [Validators.minLength(2), WhiteSpaceValidator()], nonNullable: true }),
    description: new FormControl('', { validators: [Validators.minLength(2), WhiteSpaceValidator()], nonNullable: true }),
  })

  imageInput = new FormControl<File | null>(null)

  ngOnInit(): void {
    this.updateDogForm.patchValue({
      name: this.dog().name,
      sex: this.dog().sex,
      breed: this.dog().breed,
      description: this.dog().description
    })
  }

  getErrorText(control: AbstractControl): string | null {
    return this.errorMessageService.getErrorText(control);
  }

  showDialog() {
    this.isVisible.set(true);
  }

  updateImage() {
    
    if (!this.imageInput.value) {
      throw new Error('No image selected');
    }
    return this.dogService.updateDogImage(this.imageInput.value, this.dog().id).subscribe({
      next: () => {
        this.isVisible.set(false);
      },
      error: (error) => {
        throw new Error('update image error: ' + error.message)
      }
    });

  }
  
  onSubmit() { 
    this.hasBeenSubmitted.set(true);

    if (this.updateDogForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.updateDogForm.disable();
    this.errorMessage.set(null);
    this.successMessage.set(null);


    if(!this.dog()) throw new Error('Dog not defined');
    
    return this.dogService.updateDogInfo(this.updateDogForm.value, this.dog().id).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Dog updated');
        setTimeout(() => {
          this.submitEvent.emit();
        }, 1000);
      },
      error: () => {
        this.updateDogForm.enable();
        this.isLoading.set(false);
        if (this.updateDogForm.invalid) {
          this.errorMessage.set(null)
        } else {
          this.errorMessage.set('An error occured. Please try later');
        }
      }
    });
  } 
}

