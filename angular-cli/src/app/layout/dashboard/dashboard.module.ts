import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
// import { BrowserModule } from '@angular/platform-browser';
import { ChartModule } from 'angular2-highcharts';
import * as highcharts from 'highcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';

import {
    TimelineComponent,
    NotificationComponent,
    ChatComponent
} from './components';
import { StatModule } from '../../shared';

 declare var require: any;


export function highchartsFactory() {
      const hc = require('highcharts');
      const dd = require('highcharts/modules/drilldown');
      dd(hc);

      return hc;
}

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        DashboardRoutingModule,
        StatModule,
        ChartModule,
        ReactiveFormsModule,
        FormsModule    
    ],
    declarations: [
        DashboardComponent,
        TimelineComponent,
        NotificationComponent,
        ChatComponent
    ],
    providers: [{
        provide: HighchartsStatic,
        useFactory: highchartsFactory
      }]
})
export class DashboardModule { }

