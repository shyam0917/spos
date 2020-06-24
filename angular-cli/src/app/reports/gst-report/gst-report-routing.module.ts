import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GstReportComponent } from './gst-report.component';

const routes: Routes = [{ path: '', component: GstReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GstReportRoutingModule { }
