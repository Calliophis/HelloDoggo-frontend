import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const userRole = authService.role();
  const router = inject(Router);

  if (userRole?.includes('admin')) {
    return true;
  }

  return router.parseUrl('/auth/login');
};
