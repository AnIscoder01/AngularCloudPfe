import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const roles: string[] = JSON.parse(localStorage.getItem('roles') || '[]');

  if (!token || token === 'undefined') {
    router.navigate(['login']);
    return false;
  }

  if (!roles.includes('ROLE_ADMIN')) {
    router.navigate(['machines']);
    return false;
  }

  return true;
};