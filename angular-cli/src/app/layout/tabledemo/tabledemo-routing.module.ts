import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabledemoComponent } from './tabledemo.component';

const routes: Routes = [
  { path: '', component: TabledemoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabledemoRoutingModule { }
