import { Routes } from '@angular/router';
import { authenticationGuard } from './core/authentication/guards/authentication.guard';
import { adminGuard } from './core/authentication/guards/admin.guard';

export const routes: Routes = [

    {
        path: 'auth/login',
        loadComponent: () => import('./features/user/login/login.component').then(c => c.LoginComponent)
    },
    {
        path: 'auth/signup',
        loadComponent: () => import('./features/user/signup/signup.component').then(c => c.SignupComponent)
    },
    {
        path: 'dog/all',
        loadComponent: () => import('./features/dogs/dog-gallery/dog-gallery.component').then(c => c.DogGalleryComponent)
    },
    {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent)
    },
    {
        path: 'user/me',
        loadComponent: () => import('./features/user/update-profile/update-profile.component').then(c => c.UpdateProfileComponent),
        canActivate: [authenticationGuard]
    },
    {
        path: 'user/all',
        loadComponent: () => import('./features/user/user-list/user-list.component').then(c => c.UserListComponent),
        canActivate: [adminGuard]
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
