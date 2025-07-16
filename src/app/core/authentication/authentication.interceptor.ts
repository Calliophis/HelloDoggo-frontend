import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { AuthenticationService } from "./services/authentication.service";

export function authenticationInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const authenticationService = inject(AuthenticationService)
    const token = authenticationService.token();

    let newRequest = request.clone();

    if (token) {
        newRequest = newRequest.clone({ headers: request.headers.append('Authorization', `Bearer ${token}`) });
    }

    return next(newRequest).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error) {
                if (error.error.message === 'Incorrect token') { 
                    authenticationService.logout();
                }
            }
            return throwError(() => error);
        })
    );
}