import { Component, inject, signal } from '@angular/core';
import { Dog } from '../../../core/dogs/dog.model';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'app-dog-modal',
  imports: [
    ScrollPanelModule,
    IconFieldModule,
    ButtonModule,
  ],
  templateUrl: './dog-modal.component.html'
})
export class DogModalComponent {
  config = inject(DynamicDialogConfig);

  dog = signal<Dog>(this.config.data.dog);

  adoptDog(id: string): void {
    console.log(`Adopting dog with id ${id}`);
  }
}
