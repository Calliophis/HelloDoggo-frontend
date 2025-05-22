import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "./service/auth.service";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const authService = inject(AuthService)
    const token = authService.getToken();

    let newReq = req.clone();

    if (token) {
        newReq = newReq.clone({ headers: req.headers.append('Authorization', `Bearer ${token}`) });
    }

    return next(newReq).pipe(
        catchError((error: any) => {
            
            return throwError(() => error);
        })
    );
}