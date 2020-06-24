import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CashReportComponent } from './cash-report.component';

const routes: Routes = [{ path: '', component: CashReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashReportRoutingModule { }
