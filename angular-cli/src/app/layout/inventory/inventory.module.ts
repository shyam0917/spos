import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InventoryComponent } from "./inventory.component";
import { InventoryRoutingModule } from "./inventory-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NguiAutoCompleteModule } from "@ngui/auto-complete";
// import { FileSelectDirective } from "ng2-file-upload/ng2-file-upload";
import { MatButtonModule, MatPaginatorModule } from "@angular/material";
import { FileUploadModule } from "ng2-file-upload";
@NgModule({
  imports: [
    CommonModule,
    InventoryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NguiAutoCompleteModule,
    MatButtonModule,
    MatPaginatorModule,
    FileUploadModule
  ],
  declarations: [InventoryComponent]
})
export class InventoryModule {}
