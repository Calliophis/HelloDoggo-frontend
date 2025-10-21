import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { AuthenticationService } from '../../../core/authentication/services/authentication.service';

class MockAuthenticationService {
  signup = jasmine.createSpy('signup').and.returnValue({
    subscribe: () => {
      return new HttpErrorResponse({ status: 401 });
    }
  });
}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authenticationService: MockAuthenticationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        provideHttpClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    authenticationService = TestBed.inject(AuthenticationService) as unknown as MockAuthenticationService;
    
    component.signupForm.setValue({
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email@email.email',
      password: 'Passw0rd!',
      confirmPassword: 'Passw0rd!'
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthenticationService.signup when form is valid and submitted', () => {
    component.onSubmit();

    expect(authenticationService.signup).toHaveBeenCalledWith({
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email@email.email',
      password: 'Passw0rd!'
    });
  });
  
  it('should display error message if signup returns 401', () => {
    component.onSubmit();
    expect(component.errorMessage()).toBe('This email is already used');
  })
});
