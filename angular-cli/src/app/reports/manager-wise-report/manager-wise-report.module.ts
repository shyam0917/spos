import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerWiseReportRoutingModule } from './manager-wise-report-routing.module';
import { ManagerWiseReportComponent } from './manager-wise-report.component';
import { MatPaginatorModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ManagerWiseReportRoutingModule,
    MatPaginatorModule
  ],
  declarations: [ManagerWiseReportComponent]
})
export class ManagerWiseReportModule { }
