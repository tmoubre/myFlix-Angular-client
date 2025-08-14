// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { canActivateAuth } from './core/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login',    loadComponent: () => import('./features/welcome/login.component').then(c => c.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/register/register.component').then(c => c.RegisterComponent) },

  { path: 'movies',  canActivate: [canActivateAuth],
    loadComponent: () => import('./features/movies/movie-list/movie-list.component').then(c => c.MovieListComponent)
  },
  { path: 'profile', canActivate: [canActivateAuth],
    loadComponent: () => import('./features/profile/profile.component').then(c => c.ProfileComponent)
  },

  { path: '**', redirectTo: 'login' }
];








