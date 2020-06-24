import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllStoreReportRoutingModule } from './all-store-report-routing.module';
import { AllStoreReportComponent } from './all-store-report.component';
import {MatPaginatorModule} from '@angular/material/paginator';

@NgModule({
  imports: [
    CommonModule,
    AllStoreReportRoutingModule,
    MatPaginatorModule
  ],
  declarations: [AllStoreReportComponent]
})
export class AllStoreReportModule { }
