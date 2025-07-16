import { Component, inject, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DogCardComponent } from '../dog-card/dog-card.component';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { Role } from '../../../core/authentication/models/role.type';
import { AuthenticationService } from '../../../core/authentication/services/authentication.service';
import { Dog } from '../../../core/dogs/dog.model';
import { DogService } from '../../../core/dogs/dog.service';

@Component({
  selector: 'app-dog-gallery',
  imports: [
    ProgressSpinnerModule,
    DogCardComponent,
    ButtonModule,
  ],
  templateUrl: './dog-gallery.component.html'
})
export class DogGalleryComponent {

  private dogService = inject(DogService);
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);

  dogs = signal<Dog[] | null>(null);
  isLoading = signal<boolean>(false);
  role = signal<Role | null>(this.authenticationService.role());

  constructor() {
    this.isLoading.set(true)
    this.dogService.getAllDogs().subscribe({
      next: dogsResponse => {
        this.dogs.set(dogsResponse);
        this.isLoading.set(false);  
      }
    })
  }

  onCreateDog() {
    this.router.navigateByUrl('/dog/create');
  }
}
