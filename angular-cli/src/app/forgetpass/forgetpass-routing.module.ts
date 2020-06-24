import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ForgetpassComponent } from "../forgetpass/forgetpass.component";

const routes: Routes = [{ path: "", component: ForgetpassComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgetpassRoutingModule {}
