import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CreateManagerRoutingModule } from "./create-manager-routing.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CreateManagerComponent } from "../create-manager/create-manager.component";
import { MatPaginatorModule } from '@angular/material';
// import { JsonpModule } from '@angular/http';
// import { PageHeaderModule } from './../../shared';

@NgModule({
  imports: [
    CommonModule,
    CreateManagerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    NgbModule.forRoot()
    // PageHeaderModule,
    // JsonpModule
  ],
  declarations: [CreateManagerComponent]
})
export class CreateManagerModule {}
