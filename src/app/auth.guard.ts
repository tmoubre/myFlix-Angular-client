/**
 * Source: src/app/auth.guard.ts
 * @file
 */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const hasToken = typeof localStorage !== 'undefined' && !!localStorage.getItem('token');
  if (!hasToken) { router.navigateByUrl('/login'); return false; }
  return true;
};
