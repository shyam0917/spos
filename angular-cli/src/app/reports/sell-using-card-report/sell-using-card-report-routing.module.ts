import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SellUsingCardReportComponent } from './sell-using-card-report.component';

const routes: Routes = [{ path: '', component: SellUsingCardReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellUsingCardReportRoutingModule { }
