import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guard/auth.guard';

export const routes: Routes = [
    
    {
        path: 'auth/login', 
        loadComponent: () => import('./core/auth/login/login.component').then(c => c.LoginComponent)
    },
    {
        path: 'auth/signup',
        loadComponent: () => import('./core/auth/signup/signup.component').then(c => c.SignupComponent)
    },
    {
        path: 'user/me',
        loadComponent: () => import('./user/profile/profile.component').then(c => c.ProfileComponent),
        canActivate: [authGuard]
    },
    {
        path: 'user/me/update',
        loadComponent: () => import('./user/update-profile/update-profile.component').then(c => c.UpdateProfileComponent)
    },
    {
        path: '*',
        redirectTo: ''
    }
];
