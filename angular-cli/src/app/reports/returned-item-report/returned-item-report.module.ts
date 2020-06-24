import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReturnedItemReportRoutingModule } from './returned-item-report-routing.module';
import { ReturnedItemReportComponent } from './returned-item-report.component';

@NgModule({
  imports: [
    CommonModule,
    ReturnedItemReportRoutingModule
  ],
  declarations: [ReturnedItemReportComponent]
})
export class ReturnedItemReportModule { }
