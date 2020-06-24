import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserBilledReportRoutingModule } from './user-billed-report-routing.module';
import { UserBilledReportComponent } from './user-billed-report.component';

@NgModule({
  imports: [
    CommonModule,
    UserBilledReportRoutingModule
  ],
  declarations: [UserBilledReportComponent]
})
export class UserBilledReportModule { }
