import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillTaxReportComponent } from './bill-tax-report.component';

const routes: Routes = [{ path: '', component: BillTaxReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillTaxReportRoutingModule { }
