import { signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationStateService } from './authentication-state.service';
import { UserStateService } from './user-state.service';
import { AuthenticationApiService } from './authentication-api.service';
import { AdoptApplicationStateService } from '../../adoptions/adopt-application-state.service';
import type { User } from '../models/user.model';

describe('AuthenticationStateService', () => {
  let service: AuthenticationStateService;
  let routerSpy: jasmine.SpyObj<Router>;
  let userStateSpy: jasmine.SpyObj<UserStateService>;
  let adoptStateSpy: jasmine.SpyObj<AdoptApplicationStateService>;
  let apiServiceSpy: jasmine.SpyObj<AuthenticationApiService>;
  let userSignal: WritableSignal<User | null>;

  beforeEach(() => {
    // 1. Create spies for all dependencies
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    userStateSpy = jasmine.createSpyObj('UserStateService', ['initUser', 'clearUser']);
    adoptStateSpy = jasmine.createSpyObj('AdoptApplicationStateService', ['getOwnAdoptApplications', 'refreshOwnAdoptApplications']);
    apiServiceSpy = jasmine.createSpyObj('AuthenticationApiService', ['login', 'signup']);

    // 2. Set up initial mock behavior
    userStateSpy.initUser.and.returnValue(of(undefined));
    adoptStateSpy.getOwnAdoptApplications.and.returnValue(of(undefined));
    adoptStateSpy.refreshOwnAdoptApplications.and.returnValue(of(undefined));

    // We create a real signal and attach it safely to the mock object
    userSignal = signal<User | null>(null);
    Object.defineProperty(userStateSpy, 'user', { value: userSignal, writable: true });

    // We mock localStorage so it doesn't affect our environment
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'accessToken') return 'fake-token';
      return null;
    });
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');

    TestBed.configureTestingModule({
      providers: [
        AuthenticationStateService,
        { provide: Router, useValue: routerSpy },
        { provide: UserStateService, useValue: userStateSpy },
        { provide: AdoptApplicationStateService, useValue: adoptStateSpy },
        { provide: AuthenticationApiService, useValue: apiServiceSpy }
      ]
    });

    service = TestBed.inject(AuthenticationStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize auth state on startup (Init)', () => {
    service.initAuthentication().subscribe();

    expect(userStateSpy.initUser).toHaveBeenCalled();
  });

  it('should handle successful login', () => {
    // Arrange
    const loginCredentials = { email: 'test@test.com', password: 'password' };
    apiServiceSpy.login.and.returnValue(of({ accessToken: 'new-token', role: 'admin' }));

    // Act
    service.login(loginCredentials).subscribe();

    // Assert
    expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'new-token');
    expect(userStateSpy.initUser).toHaveBeenCalled();
    expect(adoptStateSpy.getOwnAdoptApplications).toHaveBeenCalled();
  });

  it('should handle logout flow', () => {
    // Act
    service.logout();

    // Assert
    expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
    expect(userStateSpy.clearUser).toHaveBeenCalled();
    expect(adoptStateSpy.refreshOwnAdoptApplications).toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/auth/login');
  });

  it('should correctly derive role from user state', () => {
    // 1. Mock Admin User by setting the signal
    userSignal.set({ 
        id: '1', 
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@test.com',
        password: 'password'
    });
    expect(service.role()).toBe('admin');

    // 2. Mock Editor User by updating the signal
    userSignal.set({ 
        id: '2', 
        role: 'editor',
        firstName: 'Editor',
        lastName: 'User',
        email: 'editor@test.com',
        password: 'password'
    });
    expect(service.role()).toBe('editor');
  });
});
