import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { AppRoutingModule } from "./app-routing.module";
// import { UiSwitchModule } from 'ngx-ui-switch';             // august-10
import { AppComponent } from "./app.component";
import { AuthGuard } from "./shared";
import { HttpServices } from "./http-service";

import {
  NgbModule,
  NgbActiveModal,
  NgbModalRef
} from "@ng-bootstrap/ng-bootstrap";
import { NguiAutoCompleteModule } from "@ngui/auto-complete";

import { ConstantValues } from "./constant-values";
import { ExcelService } from "./shared/components/helper/excel.service";
import { ReceiptClass } from "./modals/receipt.class";
import { Inventory, Invoice, Storage } from "./modals/app.class";
import { UserRoleChecker } from "./user-role-service";
import { TokenInterceptor } from "./auth/token-interceptor";
import { VerifyService } from "./auth/verify-service";
import { ErrorsHandlerService } from "./auth/errors-handler.service";
import { GlobalServiceService } from "./auth/global-service.service";
import { SetupModal } from "./layout/set-up/set-up.modal";
import { NgIdleKeepaliveModule } from "@ng-idle/keepalive";
import { MomentModule } from "angular2-moment";

// import { UpdatePasswordComponent } from './update-password/update-password.component';
// import { ForgetpassComponent } from './forgetpass/forgetpass.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  // for development return new TranslateHttpLoader(http,
  // '/start-angular/SB-Admin-BS4-Angular-4/master/dist/assets/i18n/', '.json');
  return new TranslateHttpLoader(http, "/assets/i18n/", ".json");
}
@NgModule({
  declarations: [AppComponent, SetupModal],
  imports: [
    BrowserModule,
    NgIdleKeepaliveModule.forRoot(),
    MomentModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    NguiAutoCompleteModule,
    AppRoutingModule,
    // UiSwitchModule,          //august-10
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    AuthGuard,
    HttpServices,
    ConstantValues,
    ExcelService,
    ReceiptClass,
    Inventory,
    Invoice,
    Storage,
    NgbActiveModal,
    UserRoleChecker,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: ErrorsHandlerService
    },
    VerifyService,
    GlobalServiceService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [SetupModal]
})
export class AppModule {}
