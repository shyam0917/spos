import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CreateManagerComponent } from "../create-manager/create-manager.component";

const routes: Routes = [{ path: "", component: CreateManagerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateManagerRoutingModule {}
