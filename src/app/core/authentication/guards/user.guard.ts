import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

export const userGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const userRole = authenticationService.role();
  const router = inject(Router);

  if (userRole === 'user' || userRole === 'editor' || userRole === 'admin') {
    return true;
  }

  return router.parseUrl('/auth/login');
};
