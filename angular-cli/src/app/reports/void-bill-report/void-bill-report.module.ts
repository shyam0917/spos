import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VoidBillReportRoutingModule } from './void-bill-report-routing.module';
import { VoidBillReportComponent } from './void-bill-report.component';

@NgModule({
  imports: [
    CommonModule,
    VoidBillReportRoutingModule
  ],
  declarations: [VoidBillReportComponent]
})
export class VoidBillReportModule { }
