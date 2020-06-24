import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionReportComponent } from './transaction-report.component';

const routes: Routes = [{ path: '', component: TransactionReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionReportRoutingModule { }
