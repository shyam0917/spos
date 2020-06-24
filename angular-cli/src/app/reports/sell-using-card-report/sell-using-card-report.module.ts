import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellUsingCardReportRoutingModule } from './sell-using-card-report-routing.module';
import { SellUsingCardReportComponent } from './sell-using-card-report.component';

@NgModule({
  imports: [
    CommonModule,
    SellUsingCardReportRoutingModule
  ],
  declarations: [SellUsingCardReportComponent]
})
export class SellUsingCardReportModule { }
