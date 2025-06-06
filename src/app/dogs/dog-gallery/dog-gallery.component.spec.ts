import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DogGalleryComponent } from './dog-gallery.component';

describe('DogGalleryComponent', () => {
  let component: DogGalleryComponent;
  let fixture: ComponentFixture<DogGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DogGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
