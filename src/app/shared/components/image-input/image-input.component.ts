import { Component, computed, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
  selector: 'app-image-input',
  imports: [
    ReactiveFormsModule,
    IconFieldModule,
    ButtonModule
  ],
  templateUrl: './image-input.component.html',
  providers: [
    {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => ImageInputComponent),
          multi: true
        },
  ]
})
export class ImageInputComponent implements ControlValueAccessor {

  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  isDragOver = signal<boolean>(false);

  imageControl = new FormControl(null);

  dynamicClasses = computed<string>(() => {
    if(this.isDragOver() || this.hasImage()) return 'border-amber-500';
    return 'border-gray-300';
  });

  hasImage = computed<boolean>(() => {
    return !!this.previewUrl();
  })

  onChange!: (value: File | null) => void;
  onTouched!: () => void;

  writeValue(value: File | null): void {
    this.selectedFile.set(value);
    if (value) {
      this.generatePreview(value);
    }
  }

  registerOnChange(fn: (value: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.#processFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(event:DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);

    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.#processFile(file);
    }
  }
  
  #processFile(file: File): void {
    this.selectedFile.set(file);
    this.onChange(file);
    this.onTouched();
    this.generatePreview(file);
  }

  generatePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.imageControl.reset();
    this.onChange(null);
  }
}
