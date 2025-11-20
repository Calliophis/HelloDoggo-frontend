import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationStateService } from '../services/authentication-state.service';

export const userGuard: CanActivateFn = () => {
  const authenticationStateService = inject(AuthenticationStateService);
  const userRole = authenticationStateService.role();
  const router = inject(Router);

  if (userRole === 'user' || userRole === 'editor' || userRole === 'admin') {
    return true;
  }

  return router.parseUrl('/auth/login');
};
