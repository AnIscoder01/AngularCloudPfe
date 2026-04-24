import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // skip auth endpoints — they don't need a token
  const isAuthRequest = req.url.includes('/api/auth/');
  if (isAuthRequest) return next(req);

  const token = localStorage.getItem('token');
  console.log('Interceptor firing for:', req.url);
  console.log('Token:', token);

  if (token && token !== 'undefined') {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};