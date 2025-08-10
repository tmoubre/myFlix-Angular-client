import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/welcome/login.component').then(m => m.LoginComponent) },
  { path: 'movies', loadComponent: () => import('./features/movies/movie-list.component').then(m => m.MovieListComponent) },
  { path: 'profile', loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) },
  { path: '**', redirectTo: '' }
];
