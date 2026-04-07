import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdoptApplicationStateService } from './adopt-application-state.service';
import { AdoptApplicationApiService } from './adopt-application-api.service';
import { UserStateService } from '../authentication/services/user-state.service';
import { AdoptApplication } from './models/adopt-application.model';

describe('AdoptApplicationStateService', () => {
  let service: AdoptApplicationStateService;
  let apiServiceSpy: jasmine.SpyObj<AdoptApplicationApiService>;
  let userStateSpy: jasmine.SpyObj<UserStateService>;

  const mockApp: AdoptApplication = {
    id: '1',
    status: 'pending',
    dog: { id: 'dog1', name: 'Fluffer' },
    user: { id: 'user1', firstName: 'Lisa', lastName: 'Auger', email: 'admin@hellodoggo.com' }
  };

  beforeEach(() => {
    // 1. Create simple "spies" (mocks) for the dependencies
    apiServiceSpy = jasmine.createSpyObj('AdoptApplicationApiService', [
      'getAllAdoptApplications',
      'getOwnAdoptApplications',
      'updateAdoptApplication',
      'deleteAdoptApplication',
      'deleteOwnAdoptApplication'
    ]);
    userStateSpy = jasmine.createSpyObj('UserStateService', ['user']);

    // 2. Set up default return values for our spies
    apiServiceSpy.getAllAdoptApplications.and.returnValue(of({ adoptApplications: [mockApp], totalAdoptApplications: 1 }));
    apiServiceSpy.getOwnAdoptApplications.and.returnValue(of({ adoptApplications: [], totalAdoptApplications: 0 }));
    apiServiceSpy.updateAdoptApplication.and.returnValue(of(mockApp));
    apiServiceSpy.deleteAdoptApplication.and.returnValue(of(true));
    apiServiceSpy.deleteOwnAdoptApplication.and.returnValue(of(true));
    userStateSpy.user.and.returnValue({ 
        id: 'admin-id', 
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@test.com',
        password: 'password'
    });

    TestBed.configureTestingModule({
      providers: [
        AdoptApplicationStateService,
        { provide: AdoptApplicationApiService, useValue: apiServiceSpy },
        { provide: UserStateService, useValue: userStateSpy }
      ]
    });

    service = TestBed.inject(AdoptApplicationStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load all applications and update the signal', () => {
    // Act
    service.initAllAdoptApplications().subscribe();

    // Assert
    expect(apiServiceSpy.getAllAdoptApplications).toHaveBeenCalled();
    expect(service.adoptApplications().length).toBe(1);
    expect(service.adoptApplications()[0].dog.name).toBe('Fluffer');
  });

  it('should refresh both "All" and "Own" states when an Admin updates an application (Smart Sync)', () => {
    // Act
    service.updateAdoptApplication('1', { status: 'approved' }).subscribe();

    // Assert
    // We expect both refresh methods to have been triggered by the smart sync logic
    expect(apiServiceSpy.updateAdoptApplication).toHaveBeenCalledWith('1', { status: 'approved' });
    expect(apiServiceSpy.getAllAdoptApplications).toHaveBeenCalled();
    expect(apiServiceSpy.getOwnAdoptApplications).toHaveBeenCalled();
  });

  it('should only refresh "Own" states when a regular user deletes their application', () => {
    // Arrange
    userStateSpy.user.and.returnValue({ 
        id: 'user-id', 
        role: 'user',
        firstName: 'Regular',
        lastName: 'User',
        email: 'user@test.com',
        password: 'password'
    });
    apiServiceSpy.getOwnAdoptApplications.and.returnValue(of({ adoptApplications: [mockApp], totalAdoptApplications: 1 }));

    // Populate own apps first
    service.initOwnAdoptApplications().subscribe();
    apiServiceSpy.getAllAdoptApplications.calls.reset(); // reset counter

    // Act
    service.deleteOwnAdoptApplication('dog1').subscribe();

    // Assert
    // Admin list shouldn't be refreshed if the user is not an admin
    expect(apiServiceSpy.getAllAdoptApplications).not.toHaveBeenCalled();
    expect(apiServiceSpy.getOwnAdoptApplications).toHaveBeenCalled();
  });
});
