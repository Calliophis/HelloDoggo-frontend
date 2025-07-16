import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DogCardComponent } from './dog-card.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Dog } from '../../../core/dogs/dog.model';
import { AuthenticationService } from '../../../core/authentication/services/authentication.service';

class MockAuthenticationService {
  role() {
    return 'admin';
  } 
}

describe('DogCardComponent', () => {
  let component: DogCardComponent;
  let fixture: ComponentFixture<DogCardComponent>;
  let authenticationService: MockAuthenticationService;
  const mockDog: Dog = {
    name: 'Rex',
    breed: 'Labrador',
    sex: 'male',
    description: 'Friendly dog',
    img_url: '/images/rex.jpg',
    id: 1 
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogCardComponent],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        provideHttpClient(),
        provideAnimationsAsync(),
        
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DogCardComponent);
    authenticationService = TestBed.inject(AuthenticationService) as unknown as MockAuthenticationService;
    component = fixture.componentInstance;
    fixture.componentRef.setInput('dog', mockDog)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the dog image', () => {

    const image: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(image).toBeTruthy();
    expect(image.src).toContain('/images/rex.jpg');
  })

  it('should show edit button for admin or editor', () => {

    const editButton = fixture.nativeElement.querySelector('button');
    expect(editButton).toBeTruthy();
  });

  it('should open the dialog when edit button is clicked', () => {
    expect(component.role()).toEqual('admin');

    const editButton = fixture.nativeElement.querySelector('button');
    editButton.click();

    fixture.detectChanges();

    expect(component.isVisible()).toBeTrue();
  })
});
