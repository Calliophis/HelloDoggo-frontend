import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationStateService } from '../services/authentication-state.service';

export const authenticationGuard: CanActivateFn = () => {
  const authenticationStateService = inject(AuthenticationStateService);
  const router = inject(Router);

  const isAuthenticated = authenticationStateService.isAuthenticated();

   if (!isAuthenticated) {
    return router.parseUrl('/auth/login');
  }
  
  return true;
};
