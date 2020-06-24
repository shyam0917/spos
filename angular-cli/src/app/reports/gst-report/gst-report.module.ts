import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GstReportRoutingModule } from './gst-report-routing.module';
import { GstReportComponent } from './gst-report.component';
import { MatPaginatorModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    GstReportRoutingModule,
    MatPaginatorModule
  ],
  declarations: [GstReportComponent]
})
export class GstReportModule { }
