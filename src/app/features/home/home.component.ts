import { AfterViewInit, Component, ElementRef, inject, viewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  imports: [
    ButtonModule
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements AfterViewInit {
  private router = inject(Router);

  observer = new IntersectionObserver(
    entries => this.applyStyle(entries), 
  {
    threshold: 1
  });

  headers = viewChildren<ElementRef>('test');

  ngAfterViewInit() {
    if (this.headers()) {
      this.headers().forEach(header => {
        this.observer.observe(header.nativeElement)
      })
    }
  }

  applyStyle(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      entry.target.classList.toggle('opacity-100', entry.isIntersecting);
      if (entry.isIntersecting) this.observer.unobserve(entry.target);
    })
  }

  goToDogs() {
    this.router.navigateByUrl('/dog/all');
  }

  goToVolunteer() {
    this.router.navigateByUrl('/volunteer');
  }

  goToAbout() {
    this.router.navigateByUrl('/about');
  }

  goToContact() {
    this.router.navigateByUrl('/contact');
  }
  
  addTranslation(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      entry.target.classList.add('transform', 'translate-x-0', 'duration-3000', 'opacity-100', 'ease-in-out');
      if (entry.isIntersecting) this.observer.unobserve(entry.target);
    });
  }
}