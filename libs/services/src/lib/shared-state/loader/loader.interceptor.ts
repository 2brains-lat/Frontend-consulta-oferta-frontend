import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LoaderService } from './loader.service';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { handleError } from '../../error_dom_handle';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private $router: Router) {}
  _this = this;
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // if (request.method === 'PATCH') {
    //   return next.handle(request);
    // }
    // this.loaderService.show();
    // console.log(request, 'request', next, 'next');
    return next.handle(request).pipe(catchError((error) => throwError(error)));
  }
}
