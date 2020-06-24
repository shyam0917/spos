import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionReportRoutingModule } from './transaction-report-routing.module';
import { TransactionReportComponent } from './transaction-report.component';

@NgModule({
  imports: [
    CommonModule,
    TransactionReportRoutingModule
  ],
  declarations: [TransactionReportComponent]
})
export class TransactionReportModule { }
