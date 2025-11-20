import { Component, ElementRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IntersectionObserverDirective } from "../../shared/directives/intersection-observer.directive";

@Component({
  selector: 'app-home',
  imports: [
    ButtonModule,
    IntersectionObserverDirective
],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  #router = inject(Router);

  goToDogs() {
    this.#router.navigateByUrl('/dog/all');
  }

  toggleTitleOpacity(element: ElementRef) {
    element.nativeElement.classList.add('opacity-100');
  }
}