import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutOutOfStockReportComponent } from './about-out-of-stock-report.component';

const routes: Routes = [{ path: '', component: AboutOutOfStockReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutOutOfStockReportRoutingModule { }
