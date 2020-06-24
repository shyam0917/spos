import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseReportRoutingModule } from './expense-report-routing.module';
import { ExpenseReportComponent } from './expense-report.component';
import {MatPaginatorModule} from '@angular/material/paginator';

@NgModule({
  imports: [
    CommonModule,
    ExpenseReportRoutingModule,
    MatPaginatorModule
  ],
  declarations: [ExpenseReportComponent]
})
export class ExpenseReportModule { }
