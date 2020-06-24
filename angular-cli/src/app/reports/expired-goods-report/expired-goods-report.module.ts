import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpiredGoodsReportRoutingModule } from './expired-goods-report-routing.module';
import { ExpiredGoodsReportComponent } from './expired-goods-report.component';
import {MatPaginatorModule} from '@angular/material/paginator';
@NgModule({
  imports: [
    CommonModule,
    ExpiredGoodsReportRoutingModule,
    MatPaginatorModule
  ],
  declarations: [ExpiredGoodsReportComponent]
})
export class ExpiredGoodsReportModule { }
