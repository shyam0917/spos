import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AboutOutOfStockReportRoutingModule } from "./about-out-of-stock-report-routing.module";
import { AboutOutOfStockReportComponent } from "./about-out-of-stock-report.component";
import { MatButtonModule, MatPaginatorModule } from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    AboutOutOfStockReportRoutingModule,
    MatButtonModule,
    MatPaginatorModule
  ],
  declarations: [AboutOutOfStockReportComponent]
})
export class AboutOutOfStockReportModule {}
