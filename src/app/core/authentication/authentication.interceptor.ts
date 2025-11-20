import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { AuthenticationStateService } from "./services/authentication-state.service";

export function authenticationInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const authenticationStateService = inject(AuthenticationStateService)
    const token = authenticationStateService.token();

    let newRequest = request.clone();

    if (token) {
        newRequest = newRequest.clone({ headers: request.headers.append('Authorization', `Bearer ${token}`) });
    }

    return next(newRequest).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error) {
                if (error.error.message === 'Incorrect token') { 
                    authenticationStateService.logout();
                }
            }
            return throwError(() => error);
        })
    );
}