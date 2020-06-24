import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoreWiseReportComponent } from './store-wise-report.component';

const routes: Routes = [{ path: '', component: StoreWiseReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreWiseReportRoutingModule { }
