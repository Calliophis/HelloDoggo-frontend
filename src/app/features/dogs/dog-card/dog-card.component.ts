import { Component, inject, input, model } from '@angular/core';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { UpdateDogComponent } from '../update-dog/update-dog.component';
import { AuthenticationService } from '../../../core/authentication/services/authentication.service';
import { Dog } from '../../../core/dogs/dog.model';

@Component({
  selector: 'app-dog-card',
  imports: [
    UpdateDogComponent,
    IconFieldModule,
    ButtonModule,
    DialogModule,
    CardModule
  ],
  templateUrl: './dog-card.component.html'
})
export class DogCardComponent {
  private authenticationService = inject(AuthenticationService);

  dog = input.required<Dog>();
  role = this.authenticationService.role;
  isVisible = model(false);

  showDialog() {
    this.isVisible.set(true);
  }

  closeDialog() {
    this.isVisible.set(false);
  }
}
