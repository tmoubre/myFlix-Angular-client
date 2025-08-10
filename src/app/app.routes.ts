// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'movies', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/welcome/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./features/welcome/signup.component').then(m => m.SignupComponent) },
  { path: 'movies', loadComponent: () => import('./features/movies/movie-list.component').then(m => m.MovieListComponent) },
  { path: 'movies/:id', loadComponent: () => import('./features/movies/movie-view.component').then(m => m.MovieViewComponent) },
  { path: 'profile', loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'search', loadComponent: () => import('./features/search/search-results.component').then(m => m.SearchResultsComponent) },
  { path: '**', redirectTo: 'movies' }
];


