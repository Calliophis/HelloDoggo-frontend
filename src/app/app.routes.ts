import { Routes } from '@angular/router';

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
        path: '*',
        redirectTo: ''
    }
];
