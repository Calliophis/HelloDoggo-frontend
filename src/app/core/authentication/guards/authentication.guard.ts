import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

export const authenticationGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  const isAuthenticated = authenticationService.isAuthenticated();

   if (!isAuthenticated) {
    return router.parseUrl('/auth/login');
  }
  
  return true;
};
