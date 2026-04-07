import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserStateService } from './user-state.service';
import { UserApiService } from './user-api.service';
import { User } from '../models/user.model';

describe('UserStateService', () => {
  let service: UserStateService;
  let apiServiceSpy: jasmine.SpyObj<UserApiService>;

  const mockUser: User = {
    id: 'user-1',
    firstName: 'Lisa',
    lastName: 'Auger',
    email: 'admin@hellodoggo.com',
    password: 'password123',
    role: 'admin'
  };

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('UserApiService', ['getOwnProfile', 'getAllUsers', 'updateUserById']);
    
    apiServiceSpy.getOwnProfile.and.returnValue(of(mockUser));
    apiServiceSpy.getAllUsers.and.returnValue(of({ users: [mockUser], totalUsers: 1 }));

    TestBed.configureTestingModule({
      providers: [
        UserStateService,
        { provide: UserApiService, useValue: apiServiceSpy }
      ]
    });

    service = TestBed.inject(UserStateService);
  });

  it('should initialize the logged-in user profile', () => {
    service.initUser().subscribe();

    expect(apiServiceSpy.getOwnProfile).toHaveBeenCalled();
    expect(service.user()).toEqual(mockUser);
  });

  it('should initialize the full users list (for Admins)', () => {
    service.initAllUsers().subscribe();

    expect(apiServiceSpy.getAllUsers).toHaveBeenCalled();
    expect(service.users().length).toBe(1);
    expect(service.users()[0].email).toBe('admin@hellodoggo.com');
  });

  it('should handle pagination when loading more users', () => {
    // 1. Initial Load
    service.initAllUsers().subscribe();

    // 2. Mock Second Page
    const secondUser: User = { ...mockUser, id: 'user-2', email: 'member@hellodoggo.com' };
    apiServiceSpy.getAllUsers.and.returnValue(of({ users: [secondUser], totalUsers: 2 }));

    // 3. Load More
    service.loadMoreUsers().subscribe();

    // Assert
    expect(service.users().length).toBe(2);
    expect(service.users()[1].email).toBe('member@hellodoggo.com');
  });

  it('should refresh the users list after an update', () => {
    // Arrange
    apiServiceSpy.updateUserById.and.returnValue(of({}));
    apiServiceSpy.getAllUsers.calls.reset();

    // Act
    service.updateUserById('user-1', { firstName: 'Updated' }).subscribe();

    // Assert: update should trigger a refresh (getAllUsers)
    expect(apiServiceSpy.updateUserById).toHaveBeenCalled();
    expect(apiServiceSpy.getAllUsers).toHaveBeenCalled();
  });
});
