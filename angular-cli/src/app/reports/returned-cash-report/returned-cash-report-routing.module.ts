import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReturnedCashReportComponent } from './returned-cash-report.component';

const routes: Routes = [{ path: '', component: ReturnedCashReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnedCashReportRoutingModule { }
