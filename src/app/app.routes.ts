import { Routes } from '@angular/router';
import { editorGuard } from './core/authentication/guards/editor.guard';
import { authenticationGuard } from './core/authentication/guards/authentication.guard';

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
        path: 'dog/create',
        loadComponent: () => import('./features/dogs/create-dog/create-dog.component').then(c => c.CreateDogComponent),
        canActivate: [editorGuard]
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
        path: '**',
        redirectTo: 'home'
    }
];
