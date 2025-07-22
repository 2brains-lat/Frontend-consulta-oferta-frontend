import { Injectable, ErrorHandler } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { ALERT_FLAG } from './api/consulta-oferta.service';
import {
  ConsultaOfertaService,
  RequestStatusAlertService,
} from '@verisure/services';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { BrowserAuthError } from '@azure/msal-browser';

@Injectable()
export class ErroInterceptor implements HttpInterceptor {
  constructor(
    private $router: Router,
    private alertService: RequestStatusAlertService
  ) {}
  _this = this;
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // if (request.method === 'PATCH') {
    //   return next.handle(request);
    // }

    return next.handle(request).pipe(
      catchError((error) => {
        if (
          request.context.get(ALERT_FLAG) &&
          ((error.status >= 400 && error.status < 600) || error.status !== 401)
        ) {
          // use alert service
          this.alertService.success({
            status: error.status,
            message: error?.error?.message ?? 'Oops, ocurrio un error',
          });
          return throwError('Alert Error Action!');
        }
        return throwError(error);
      })
    );
  }
}

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
  constructor(private $router: Router) {}
  handleError(error: any) {
    console.dir(error);
    console.log(
      error,
      error.rejection,
      error.message,
      error?.errorCode,
      error.Error,
      error.unCaught,
      error.BrowserAuthError,
      typeof error,
      ' ! CustomErrorHandler !!'
    );

    handleError({
      error,
      router: this.$router,
    });
  }
}

export const handleError = ({
  error,
  router,
}: {
  error: any;
  router: Router;
}) => {
  // client-side error
  if (error instanceof DOMException) {
    // Handle the DOMException error here (bad sintaxis or if someone tried to break something)
    console.error('DOMException error:', error);
    router?.navigate(['Oops']);
  }
  console.log('IS NOT A DOM ERROR');
  ///if there a MSAL critical error, so we send the user to unathorized-error
  if (error?.rejection instanceof BrowserAuthError) {
    console.log('IS A BrowserAuthError ERROR');
    router?.navigate(['unauthorized-error']);
  }
  if (error?.rejection?.errorCode === 'login_required') {
    window.location.href = '/';
  }

  if (error?.error instanceof ErrorEvent) {
    // error on load something like IMAGE, SVG ,ETC
    return;
  }
  // server-side error
  else {
    if (error.status >= 500 || error.status === 0) {
      //  redirect to error page
      router?.navigate(['server-error']);
    } else if (error.status === 400) {
      router?.navigate(['Oops']);
    } else if (error.status > 400 && error.status < 404) {
      router?.navigate(['unauthorized-error']);
    } else if (error.status > 403 && error.status < 500) {
      //  redirect to error page
      router?.navigate(['not-found']);
    }
  }
  return;
};
function findWordInString(arr: Array<any>, str: string) {
  for (let i = 0; i < arr.length; i++) {
    if (str.includes(arr[i])) {
      return arr[i];
    }
  }
  return null;
}

const haveThisWordInThisText = (text: string, word: string): boolean => {
  // Convertir el texto y la palabra a minúsculas para hacer una búsqueda sin distinción de mayúsculas y minúsculas
  text = text.toLowerCase();
  word = word.toLowerCase();
  // Buscar la palabra en el texto
  return text.indexOf(word) !== -1;
};
