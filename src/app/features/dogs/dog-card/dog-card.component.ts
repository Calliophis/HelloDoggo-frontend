import { Component, inject, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UpdateDogComponent } from '../update-dog/update-dog.component';
import { AuthenticationStateService } from '../../../core/authentication/services/authentication-state.service';
import { Dog } from '../../../core/dogs/dog.model';

@Component({
  selector: 'app-dog-card',
  imports: [
    DynamicDialogModule,
    IconFieldModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './dog-card.component.html',
  providers: [DialogService]
})
export class DogCardComponent {
  ref: DynamicDialogRef | undefined;
  
  #authenticationStateService = inject(AuthenticationStateService);
  #dialogService = inject(DialogService);

  dog = input.required<Dog>();
  role = this.#authenticationStateService.role;

  showUpdateDialog(dog: Dog) {
    this.ref = this.#dialogService.open(UpdateDogComponent, {
      data: { 
        dog
      }, 
      header: 'Update your dog information',
      width: '30rem',
      modal: true,
    });
  }
}
