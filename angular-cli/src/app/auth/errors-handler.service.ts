import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { GlobalServiceService } from './global-service.service';
// import { SpinnerVisibilityService } from 'ng-http-loader/services/spinner-visibility.service';
declare var alertify: any;

@Injectable()
export class ErrorsHandlerService implements ErrorHandler {

  constructor(
    private injector: Injector,
    public globalService: GlobalServiceService,
    // public spinner: SpinnerVisibilityService
  ) { }

  handleError(error: Error | HttpErrorResponse) {

    const router = this.injector.get(Router);

    if (error instanceof HttpErrorResponse) {
      // Server or connection error happened

      if (!window.navigator.onLine) {
        // Handle offline error or No Internet Happened

        // this.spinner.visibilitySubject.next(false);
        this.globalService.getSpinnerFlag(false);
        alertify.error('No Internet Connection....');
        router.navigate(['/login']);
        // return Observable.throw(error);

      } else {
        // Handle Http Error (error.status === 403, 404...)

        if (error.status != 200 && error.status != 304) {
          localStorage.clear();
          if (router.url !== '/') {
            localStorage.clear();
            alertify.error('API Response Authentication Failed...')
            router.navigate(['/login']);
          }
        }
      }
    } else {
      // Handle Client Error (Angular Error, ReferenceError...)

      alertify.warning('Client-Side Angular or Reference Error....')
      localStorage.clear();
      router.navigate(['/login']);
    }

    // Log the error anyway
    // console.error('It happens: ', error);
  }
}
