import { Directive, ElementRef, EventEmitter, inject, Output } from "@angular/core";

@Directive({
    selector: '[appIntersectionObserver]'
})
export class IntersectionObserverDirective {
    @Output()
    appIntersectionObserver = new EventEmitter<ElementRef>();

    #element = inject(ElementRef);

    observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            this.appIntersectionObserver.emit(this.#element);
        }},
        {
            root: null,
            rootMargin: '0px',
            threshold: 1
        }
    );

    constructor() {
        if (this.#element) {
            this.observer.observe(this.#element.nativeElement)  
        }
    }
}
