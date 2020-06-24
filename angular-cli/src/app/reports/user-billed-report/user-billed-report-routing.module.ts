import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserBilledReportComponent } from './user-billed-report.component';

const routes: Routes = [{ path: '', component: UserBilledReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserBilledReportRoutingModule { }
