import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesReportRoutingModule } from './sales-report-routing.module';
import { SalesReportComponent } from './sales-report.component';

@NgModule({
  imports: [
    CommonModule,
    SalesReportRoutingModule
  ],
  declarations: [SalesReportComponent]
})
export class SalesReportModule { }
