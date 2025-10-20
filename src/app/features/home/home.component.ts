import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AnimatedTitleDirective } from '../../shared/directives/animated-title.directive';

@Component({
  selector: 'app-home',
  imports: [
    AnimatedTitleDirective,
    ButtonModule
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  private router = inject(Router);

  goToDogs() {
    this.router.navigateByUrl('/dog/all');
  }
}