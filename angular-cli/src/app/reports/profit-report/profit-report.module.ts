import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfitReportRoutingModule } from './profit-report-routing.module';
import { ProfitReportComponent } from './profit-report.component';

@NgModule({
  imports: [
    CommonModule,
    ProfitReportRoutingModule
  ],
  declarations: [ProfitReportComponent]
})
export class ProfitReportModule { }
