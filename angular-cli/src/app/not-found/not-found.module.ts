import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { NotFoundComponent } from './not-found.component';
import { NotFoundRoutingModule } from './not-found-routing.module';

import { ErrorsHandlerService } from '../auth/errors-handler.service';
import { TokenInterceptor } from '../auth/token-interceptor';

@NgModule({
    imports: [
        NotFoundRoutingModule,
        RouterModule
    ],
    declarations: [NotFoundComponent],
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
      },
      {
        provide: ErrorHandler,
        useClass: ErrorsHandlerService,
      },
    ]
})
export class NotFoundModule {}
