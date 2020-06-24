import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ForgetpassComponent } from "../forgetpass/forgetpass.component";
import { FormsModule } from "@angular/forms";
import { ForgetpassRoutingModule } from "./forgetpass-routing.module";
import { MatProgressSpinnerModule } from "@angular/material";
@NgModule({
  imports: [
    CommonModule,
    ForgetpassRoutingModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  declarations: [ForgetpassComponent],
  exports: [ForgetpassComponent]
})
export class ForgetpassModule {}
