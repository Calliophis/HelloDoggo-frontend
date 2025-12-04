import { Component, inject, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UpdateDogComponent } from '../update-dog/update-dog.component';
import { AuthenticationStateService } from '../../../core/authentication/services/authentication-state.service';
import { Dog } from '../../../core/dogs/dog.model';
import { DogModalComponent } from '../dog-modal/dog-modal.component';

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
  ref: DynamicDialogRef | null = null;
  
  #authenticationStateService = inject(AuthenticationStateService);
  #dialogService = inject(DialogService);

  dog = input.required<Dog>();
  role = this.#authenticationStateService.role;

  showUpdateDialog(dog: Dog, event: Event) {
    event.stopPropagation();
    this.ref = this.#dialogService.open(UpdateDogComponent, {
      data: { 
        dog
      }, 
      header: 'Update your dog information',
      width: '30rem',
      modal: true,
    });
  }

  showDogModal(dog: Dog) {
    this.ref = this.#dialogService.open(DogModalComponent, {
      data: {
        dog
      },
      modal: true,
      closable: true,
      closeOnEscape: true,
      dismissableMask: true,
      showHeader: false,
    })
  }
}
