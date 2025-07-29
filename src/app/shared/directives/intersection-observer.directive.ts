import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appIntersectionObserver]'
})
export class IntersectionObserverDirective {
  private element = inject(ElementRef);

  observer = new IntersectionObserver(
    entries => this.applyStyle(entries), 
  {
    threshold: 1
  });

  constructor() {
    if (this.element) {
      this.observer.observe(this.element.nativeElement)
    }
  }

  applyStyle(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      entry.target.classList.toggle('opacity-100', entry.isIntersecting);
      if (entry.isIntersecting) this.observer.unobserve(entry.target);
    })
  }
}
