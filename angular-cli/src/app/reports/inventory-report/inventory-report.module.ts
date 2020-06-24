import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InventoryReportComponent } from "./inventory-report.component";
import { InventoryReportRoutingModule } from "./inventory-report-routing.module";
import { MatButtonModule, MatPaginatorModule } from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    InventoryReportRoutingModule,
    MatButtonModule,
    MatPaginatorModule
  ],
  declarations: [InventoryReportComponent]
})
export class InventoryReportModule {}
