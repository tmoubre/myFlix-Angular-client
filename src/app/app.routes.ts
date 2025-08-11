// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',   loadComponent: () => import('./features/welcome/login.component').then(m => m.LoginComponent) },
  { path: 'movies',  loadComponent: () => import('./features/movies/movie-list/movie-list.component').then(m => m.MovieListComponent) },
  { path: 'profile', loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) },
  { path: '**', redirectTo: 'movies' }
];



