import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OutOfStockReportComponent } from './out-of-stock-report.component';

const routes: Routes = [{ path: '', component: OutOfStockReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutOfStockReportRoutingModule { }
