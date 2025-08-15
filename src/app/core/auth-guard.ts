/**
 * Source: src/app/core/auth-guard.ts
 * @file
 */
import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

export const canActivateAuth: CanActivateFn = (): boolean | UrlTree => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  return token ? true : router.createUrlTree(['/login']);
};




