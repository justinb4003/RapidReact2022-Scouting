import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorDialogComponent } from '../components/dialogs/http-error-dialog/http-error-dialog.component';

@Injectable()
export class ErrorCatchingInterceptor implements HttpInterceptor {

  constructor(
    private dialog: MatDialog,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
      catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          if (error.error instanceof ErrorEvent) {
              console.log('This is client side error');
              errorMsg = `Error: ${error.error.message}`;
          } else {
              console.log('This is server side error');
              errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
            const ref = this.dialog.open(HttpErrorDialogComponent,
              {
                height: '70vh',
                width: '100%',
                data: error,
              }
            );
          }
          console.error(errorMsg);
          return throwError(errorMsg);
      }),
    )
  }
}
