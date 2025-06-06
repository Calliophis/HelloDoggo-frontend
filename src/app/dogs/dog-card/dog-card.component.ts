import { Component, input } from '@angular/core';
import { Dog } from '../../shared/models/dog.model';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dog-card',
  imports: [
    IconFieldModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './dog-card.component.html'
})
export class DogCardComponent {
  dog = input<Dog | null>(null);
}
