import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpecialDiscountReportComponent } from './special-discount-report.component';

const routes: Routes = [{ path: '', component: SpecialDiscountReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialDiscountReportRoutingModule { }
