import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReturnedItemReportComponent } from './returned-item-report.component';

const routes: Routes = [{ path: '', component: ReturnedItemReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnedItemReportRoutingModule { }
