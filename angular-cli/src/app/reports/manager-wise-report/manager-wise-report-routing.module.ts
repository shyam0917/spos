import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagerWiseReportComponent } from './manager-wise-report.component';

const routes: Routes = [{ path: '', component: ManagerWiseReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerWiseReportRoutingModule { }
