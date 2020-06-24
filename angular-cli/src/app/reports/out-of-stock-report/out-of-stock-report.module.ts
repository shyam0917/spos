import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { OutOfStockReportRoutingModule } from "./out-of-stock-report-routing.module";
import { OutOfStockReportComponent } from "./out-of-stock-report.component";
import { MatButtonModule, MatPaginatorModule } from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatPaginatorModule,
    OutOfStockReportRoutingModule
  ],
  declarations: [OutOfStockReportComponent]
})
export class OutOfStockReportModule {}
