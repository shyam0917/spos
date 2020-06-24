import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReturnedCashReportRoutingModule } from './returned-cash-report-routing.module';
import { ReturnedCashReportComponent } from './returned-cash-report.component';

@NgModule({
  imports: [
    CommonModule,
    ReturnedCashReportRoutingModule
  ],
  declarations: [ReturnedCashReportComponent]
})
export class ReturnedCashReportModule { }
