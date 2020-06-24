import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpecialDiscountReportRoutingModule } from './special-discount-report-routing.module';
import { SpecialDiscountReportComponent } from './special-discount-report.component';

@NgModule({
  imports: [
    CommonModule,
    SpecialDiscountReportRoutingModule
  ],
  declarations: [SpecialDiscountReportComponent]
})
export class SpecialDiscountReportModule { }
