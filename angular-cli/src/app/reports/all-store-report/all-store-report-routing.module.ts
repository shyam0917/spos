import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllStoreReportComponent } from './all-store-report.component';

const routes: Routes = [{ path: '', component: AllStoreReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllStoreReportRoutingModule { }
