import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillTaxReportRoutingModule } from './bill-tax-report-routing.module';
import { BillTaxReportComponent } from './bill-tax-report.component';

@NgModule({
  imports: [
    CommonModule,
    BillTaxReportRoutingModule
  ],
  declarations: [BillTaxReportComponent]
})
export class BillTaxReportModule { }
