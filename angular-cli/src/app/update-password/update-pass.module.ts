import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UpdatePasswordComponent } from "../update-password/update-password.component";
import { UpdatepassRoutingModule } from "./updatepass-routing.module";

@NgModule({
  imports: [CommonModule, FormsModule, UpdatepassRoutingModule],
  declarations: [UpdatePasswordComponent],
  exports: [UpdatePasswordComponent]
})
export class UpdatePassModule {}
