import { Component, inject, signal } from '@angular/core';
import { DogService } from '../service/dog.service';
import { Dog } from '../../shared/models/dog.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DogCardComponent } from '../dog-card/dog-card.component';

@Component({
  selector: 'app-dog-gallery',
  imports: [
    ProgressSpinnerModule,
    DogCardComponent,
  ],
  templateUrl: './dog-gallery.component.html'
})
export class DogGalleryComponent {

  private dogService = inject(DogService);

  dogs = signal<Dog[] | null>(null);
  isLoading = signal<boolean>(false);

  constructor() {
    this.isLoading.set(true)
    this.dogService.getAllDogs().subscribe({
      next: res => {
        this.dogs.set(res);
        this.isLoading.set(false);  
      }
    })
  }
}
