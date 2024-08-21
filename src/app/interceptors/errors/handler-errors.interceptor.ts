import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { EMPTY, catchError, throwError } from 'rxjs';

export const HandlerErrorsInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastrService)

  return next(req).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        switch (err.status) {
          case 400:
            console.error('Bad request:', err);
            break;
          case 401:
            console.error('Unauthorized request:', err);
            break;
          case 404:
            console.error('Not found:', err);
            break;
          case 500: default:
            toast.error("Ocorreu um erro. Por favor, tente novamente!")
            break;
        }
        return throwError(() => err);
      }
      return EMPTY;
    })
  );
};
