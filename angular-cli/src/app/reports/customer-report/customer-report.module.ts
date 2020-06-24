import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerReportRoutingModule } from './customer-report-routing.module';
import { CustomerReportComponent } from './customer-report.component';

@NgModule({
  imports: [
    CommonModule,
    CustomerReportRoutingModule
  ],
  declarations: [CustomerReportComponent]
})
export class CustomerReportModule { }
