import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { routes } from "../../../app.routes";
import { signal } from "@angular/core";
import { AuthenticationService } from "./authentication.service";

describe('AuthenticationService', () => {
    let service: AuthenticationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [],
            providers: [ 
                AuthenticationService,
                provideHttpClient(),
                provideRouter(routes)
            ]
        })
        .compileComponents();

        service = TestBed.inject(AuthenticationService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should return isAuthenticated as true when token exists', () => {
        service.token = signal<string | null>('token');
        expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return isAuthenticated as false when token is null', () => {
        service.token = signal<string | null>(null);
        expect(service.isAuthenticated()).toBeFalse();
    });
})