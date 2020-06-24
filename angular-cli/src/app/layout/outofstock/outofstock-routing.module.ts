import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OutofstockComponent } from './outofstock.component';
const routes: Routes = [{ path: '', component: OutofstockComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutofstockRoutingModule { }
