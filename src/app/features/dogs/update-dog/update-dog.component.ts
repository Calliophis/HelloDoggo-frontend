import { Component, DestroyRef, inject, model, OnInit, signal } from '@angular/core';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../../environments/environment';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DeleteDialogComponent } from '../../user/components/delete-dialog/delete-dialog.component';

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
  providers: [DialogService],
  templateUrl: './update-dog.component.html'
})
export class UpdateDogComponent implements OnInit {
  deleteRef: DynamicDialogRef | undefined;
  public config = inject(DynamicDialogConfig);
  public updateRef = inject(DynamicDialogRef);

  private errorMessageService = inject(ErrorMessageService);
  private dogService = inject(DogService);
  private destroyRef = inject(DestroyRef);
  public dialogService = inject(DialogService);

  dog = signal<Dog>(this.config.data.dog);
  hasBeenSubmitted = signal<boolean>(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string |null>(null);
  
  isVisibleUpdateImageDialog = model<boolean>(false);

  updateDogForm = new FormGroup<UpdateDogForm>({
    name: new FormControl('', { validators: [Validators.minLength(2), WhiteSpaceValidator()], nonNullable: true }),
    sex: new FormControl('male', { nonNullable: true }),
    breed: new FormControl('', { validators: [Validators.minLength(2), WhiteSpaceValidator()], nonNullable: true }),
    description: new FormControl('', { validators: [Validators.minLength(2), WhiteSpaceValidator()], nonNullable: true }),
  })

  imageInput = new FormControl<File | null>(null);

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

  cancelUpdate(): void {
    this.updateDogForm.patchValue({
      name: this.dog().name,
      sex: this.dog().sex,
      breed: this.dog().breed,
      description: this.dog().description
    });

    this.updateRef.close();
  }

  showUpdateImageDialog(): void {
    this.isVisibleUpdateImageDialog.set(true);
  }

  showDeleteDialog(): void {
    this.deleteRef = this.dialogService.open(DeleteDialogComponent, {
      header: 'Are you sure?',
      width: '20rem',
      modal: true, 
    });

    this.deleteRef.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((confirmed) => {
      if (confirmed) {
        this.deleteDog();
      }
    })
  }

  updateImage(): void {
    if (!this.imageInput.value) {
      throw new Error('No image selected');
    }

    const formData = this.dogService.generateUpdateDogImageFormData(this.imageInput.value); 

    this.isLoading.set(true);
    this.dogService.updateDogImage(formData, this.dog().id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isVisibleUpdateImageDialog.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        throw new Error('update image error: ' + error.message)
      }
    });
  }
  
  onSubmit(): void { 
    this.hasBeenSubmitted.set(true);

    if (this.updateDogForm.invalid) {
      return;
    }

    this.updateDogForm.disable();
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if(!this.dog()) throw new Error('Dog not defined');
    
    this.isLoading.set(true);
    this.dogService.updateDogInfo(this.updateDogForm.value, this.dog().id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.updateDogForm.enable();
        this.successMessage.set('Dog updated');
        this.updateRef.close();
      },
      error: () => {
        this.isLoading.set(false);
        this.updateDogForm.enable();
        if (this.updateDogForm.invalid) {
          this.errorMessage.set(null)
        } else {
          this.errorMessage.set('An error occured. Please try later');
        }
      }
    });
  }
  
  deleteDog(): void {
    this.isLoading.set(true);
    this.dogService.deleteDog(this.dog().id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.updateRef.close()
    });
  }

  getImageUrl(path: string): string {
    return `${environment.apiUrl}${path}`;
  }
}

