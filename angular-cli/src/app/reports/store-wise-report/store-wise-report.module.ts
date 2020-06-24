import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreWiseReportRoutingModule } from './store-wise-report-routing.module';
import { StoreWiseReportComponent } from './store-wise-report.component';
import {MatPaginatorModule} from '@angular/material/paginator';

@NgModule({
  imports: [
    CommonModule,
    StoreWiseReportRoutingModule, 
    MatPaginatorModule
  ],
  declarations: [StoreWiseReportComponent]
})
export class StoreWiseReportModule { }
