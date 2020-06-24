import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CashReportRoutingModule } from './cash-report-routing.module';
import { CashReportComponent } from './cash-report.component';

@NgModule({
  imports: [
    CommonModule,
    CashReportRoutingModule
  ],
  declarations: [CashReportComponent]
})
export class CashReportModule { }
