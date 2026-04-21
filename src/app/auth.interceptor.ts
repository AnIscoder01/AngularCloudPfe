import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // Skip JWT for VMware API calls — they use Basic auth
  const isVmwareRequest = req.url.includes('/api/vms') || req.url.includes('/api/vms/');
    if (isVmwareRequest) return next(req);

  const token = localStorage.getItem('token');

  if (token && token !== "undefined") {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};