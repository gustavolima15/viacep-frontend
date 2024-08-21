import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';


export const authInterceptor: HttpInterceptorFn = (req, next) => {


  const authService = inject(AuthService);
  authService.isLoggedIn();

  const authToken = localStorage.getItem('auth-token');
  if (authToken) {
    const cloned = req.clone({
      setHeaders: {
        authorization: "Bearer " + authToken,
      },
    });
    return next(cloned);
  }

    return next(req);

};
