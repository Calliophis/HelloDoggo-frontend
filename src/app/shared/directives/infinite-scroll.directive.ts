import { Directive, ElementRef, EventEmitter, inject, Output } from "@angular/core";
import { DogService } from "../../core/dogs/dog.service";

@Directive({
    selector: '[appInfiniteScroll]'
})
export class InfiniteScrollDirective {
    @Output()
    appInfiniteScroll = new EventEmitter<boolean>();

    private element = inject(ElementRef);
    private dogService = inject(DogService);

    observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            this.appInfiniteScroll.emit(true);
        }},
        {
            root: null,
            rootMargin: '0px',
            threshold: 1
        }
    );

    constructor() {
        if (this.element) {
            this.observer.observe(this.element.nativeElement)  
        }
    }
}
