// import { Injectable, Injector } from '@angular/core';
// import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// // import { Observable } from 'rxjs/Rx';
// import { PACKAGE_ROOT_URL } from '@angular/core/src/application_tokens';
// import { VerifyService } from './verify-service';

// import 'rxjs/add/observable/throw'
// import 'rxjs/add/operator/catch';
// import { Router } from '@angular/router';

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor { 
//   constructor(private injector: Injector, private router: Router) { }

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     // console.log("intercepted request ... ");

//     request = request.clone({
//       setHeaders: {
//         token: JSON.stringify(this.getToken())
//       }
//     });
//     // console.log("Sending request with new header now ...");

//     return next.handle(request);
//   }


//   getToken(){
//     //   this.verifyToken();
//       if(localStorage.getItem('access_token') != null)
//       return localStorage.getItem('access_token');
//       else
//       return "null";
//   }
// }



import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PACKAGE_ROOT_URL } from '@angular/core/src/application_tokens';
import { VerifyService } from './verify-service';
import { Router } from '@angular/router';

import { throwError } from 'rxjs';
import { catchError, tap, delay, retry } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private injector: Injector, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log("intercepted request ... ");

    request = request.clone({
      setHeaders: {
        token: JSON.stringify(this.getToken())
      }
    });
    // console.log("Sending request with new header now ...");

    return next.handle(request);
  }

  getToken() {
    //   this.verifyToken();
    if (localStorage.getItem('access_token') != null)
      return localStorage.getItem('access_token');
    else
      return "null";
  }
}