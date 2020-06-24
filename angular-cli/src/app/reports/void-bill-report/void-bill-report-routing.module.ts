import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VoidBillReportComponent } from './void-bill-report.component';

const routes: Routes = [{ path: '', component: VoidBillReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoidBillReportRoutingModule { }
