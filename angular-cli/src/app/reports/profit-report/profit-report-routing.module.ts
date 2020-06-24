import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfitReportComponent } from './profit-report.component';

const routes: Routes = [{ path: '', component: ProfitReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfitReportRoutingModule { }
